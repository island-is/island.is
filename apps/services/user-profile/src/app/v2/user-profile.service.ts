import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { Op } from 'sequelize'
import { InjectModel } from '@nestjs/sequelize'
import { isEmail } from 'class-validator'
import addMonths from 'date-fns/addMonths'
import { Sequelize } from 'sequelize-typescript'

import { isDefined, isSearchTermValid } from '@island.is/shared/utils'
import { AttemptFailed, NoContentException } from '@island.is/nest/problem'
import type { ConfigType } from '@island.is/nest/config'
import {
  DelegationsApi,
  DelegationsControllerGetDelegationRecordsDirectionEnum,
} from '@island.is/clients/auth/delegation-api'

import { VerificationService } from '../user-profile/verification.service'
import { UserProfile } from '../user-profile/userProfile.model'
import { formatPhoneNumber } from '../utils/format-phone-number'
import { PatchUserProfileDto } from './dto/patch-user-profile.dto'
import { UserProfileDto } from './dto/user-profile.dto'
import { IslykillService } from './islykill.service'
import { DataStatus } from '../user-profile/types/dataStatusTypes'
import { NudgeType } from '../types/nudge-type'
import { PaginatedUserProfileDto } from './dto/paginated-user-profile.dto'
import { ClientType } from '../types/ClientType'
import { UserProfileConfig } from '../../config'
import { ActorProfile } from './models/actor-profile.model'
import {
  ActorProfileDto,
  MeActorProfileDto,
  PaginatedActorProfileDto,
  ActorProfileDetailsDto,
} from './dto/actor-profile.dto'
import { DocumentsScope } from '@island.is/auth/scopes'
import { Emails } from './models/emails.model'
import { uuid } from 'uuidv4'
import { ActorProfileEmailDto } from './dto/actor-profile-email.dto'

export const NUDGE_INTERVAL = 6
export const SKIP_INTERVAL = 1

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel(UserProfile)
    private readonly userProfileModel: typeof UserProfile,
    @InjectModel(ActorProfile)
    private readonly delegationPreference: typeof ActorProfile,
    @Inject(VerificationService)
    private readonly verificationService: VerificationService,
    private readonly islykillService: IslykillService,
    private sequelize: Sequelize,
    @Inject(UserProfileConfig.KEY)
    private config: ConfigType<typeof UserProfileConfig>,
    private readonly delegationsApi: DelegationsApi,
    @InjectModel(Emails)
    private readonly emailModel: typeof Emails,
    @InjectModel(ActorProfile)
    private readonly actorProfileModel: typeof ActorProfile,
  ) {}

  async findAllBySearchTerm(search: string): Promise<PaginatedUserProfileDto> {
    // Validate search term
    if (!isSearchTermValid(search)) {
      throw new BadRequestException('Invalid search term')
    }

    const userProfiles = await this.userProfileModel.findAll({
      include: [
        {
          model: Emails,
          as: 'emails',
          required: false, // still include even if the match is in nationalId or phone
          where: {
            primary: true,
          },
        },
      ],
      where: {
        [Op.or]: [
          { nationalId: search },
          { mobilePhoneNumber: search },
          {
            // This will make Sequelize join on emails, and allow filtering based on it
            '$emails.email$': search,
          },
        ],
      },
    })
    const userProfileDtos = userProfiles.map((userProfile) => ({
      nationalId: userProfile.nationalId,
      email: userProfile.emails?.[0]?.email ?? '',
      mobilePhoneNumber: userProfile.mobilePhoneNumber,
      locale: userProfile.locale,
      mobilePhoneNumberVerified: userProfile.mobilePhoneNumberVerified ?? false,
      emailVerified:
        userProfile.emails?.[0]?.emailStatus === DataStatus.VERIFIED ||
        userProfile.emails?.[0]?.emailStatus === DataStatus.EMPTY,
      documentNotifications: userProfile.documentNotifications,
      emailNotifications: userProfile.emailNotifications,
      lastNudge: userProfile.lastNudge,
      nextNudge: userProfile.nextNudge,
    }))

    return {
      data: userProfileDtos,
      totalCount: userProfileDtos.length,
      pageInfo: {
        hasNextPage: false,
      },
    }
  }

  async findById(
    nationalId: string,
    useMaster = false,
    clientType: ClientType = ClientType.THIRD_PARTY,
  ): Promise<UserProfileDto> {
    const userProfile = await this.userProfileModel.findOne({
      include: [
        {
          model: Emails,
          as: 'emails',
          required: true,
          where: {
            primary: true,
          },
        },
      ],
      where: { nationalId },
      useMaster,
    })

    if (!userProfile) {
      return {
        nationalId,
        email: null,
        mobilePhoneNumber: null,
        locale: null,
        mobilePhoneNumberVerified: false,
        emailVerified: false,
        documentNotifications: true,
        needsNudge: null,
        emailNotifications: true,
        isRestricted: false,
      }
    }

    return this.filterByClientTypeAndRestrictionDate(clientType, userProfile)
  }

  async patch(
    user: {
      nationalId: string
      audkenniSimNumber?: string
    },
    userProfile: PatchUserProfileDto,
  ): Promise<UserProfileDto> {
    const { nationalId, audkenniSimNumber } = user
    const isEmailDefined = isDefined(userProfile.email)
    const isMobilePhoneNumberDefined = isDefined(userProfile.mobilePhoneNumber)

    const audkenniSimSameAsMobilePhoneNumber =
      audkenniSimNumber &&
      isMobilePhoneNumberDefined &&
      this.checkAudkenniSameAsMobilePhoneNumber(
        audkenniSimNumber,
        userProfile.mobilePhoneNumber,
      )

    const shouldVerifyEmail = isEmailDefined && userProfile.email !== ''
    const shouldVerifyMobilePhoneNumber =
      !audkenniSimSameAsMobilePhoneNumber &&
      isMobilePhoneNumberDefined &&
      userProfile.mobilePhoneNumber !== ''

    if (shouldVerifyEmail && !isDefined(userProfile.emailVerificationCode)) {
      throw new BadRequestException('Email verification code is required')
    }

    if (
      shouldVerifyMobilePhoneNumber &&
      !isDefined(userProfile.mobilePhoneNumberVerificationCode)
    ) {
      throw new BadRequestException(
        'Mobile phone number verification code is required',
      )
    }

    await this.sequelize.transaction(async (transaction) => {
      const commonArgs = [nationalId, { transaction, maxTries: 3 }] as const

      if (shouldVerifyEmail) {
        const { confirmed, message, remainingAttempts } =
          await this.verificationService.confirmEmail(
            {
              email: userProfile.email!,
              hash: userProfile.emailVerificationCode!,
            },
            ...commonArgs,
          )

        if (!confirmed) {
          // Check if we should throw a BadRequest or an AttemptFailed error
          if (remainingAttempts && remainingAttempts >= 0) {
            throw new AttemptFailed(remainingAttempts, {
              emailVerificationCode: 'Verification code does not match.',
            })
          } else {
            throw new BadRequestException(message)
          }
        }
      }

      if (shouldVerifyMobilePhoneNumber) {
        const { confirmed, message, remainingAttempts } =
          await this.verificationService.confirmSms(
            {
              mobilePhoneNumber: userProfile.mobilePhoneNumber!,
              code: userProfile.mobilePhoneNumberVerificationCode!,
            },
            ...commonArgs,
          )

        if (confirmed === false) {
          // Check if we should throw a BadRequest or an AttemptFailed error
          if (remainingAttempts && remainingAttempts >= 0) {
            throw new AttemptFailed(remainingAttempts, {
              smsVerificationCode: 'Verification code does not match.',
            })
          } else if (remainingAttempts === -1) {
            throw new AttemptFailed(0)
          } else {
            throw new BadRequestException(message)
          }
        }
      }

      const formattedPhoneNumber = isMobilePhoneNumberDefined
        ? formatPhoneNumber(userProfile.mobilePhoneNumber)
        : undefined

      const currentUserProfile = await this.userProfileModel.findOne({
        include: {
          model: Emails,
          as: 'emails',
          required: true,
          where: {
            primary: true,
          },
        },
        where: { nationalId },
        transaction,
        useMaster: true,
      })

      const update = {
        nationalId,
        ...(isMobilePhoneNumberDefined && {
          mobilePhoneNumber: formattedPhoneNumber || null,
          mobilePhoneNumberVerified: formattedPhoneNumber !== '',
          mobileStatus: formattedPhoneNumber
            ? DataStatus.VERIFIED
            : currentUserProfile?.mobileStatus === DataStatus.NOT_VERIFIED
            ? DataStatus.NOT_DEFINED
            : DataStatus.EMPTY,
        }),
        ...(isDefined(userProfile.locale) && {
          locale: userProfile.locale,
        }),
        ...(isDefined(userProfile.emailNotifications) && {
          emailNotifications: userProfile.emailNotifications,
        }),
        ...(isDefined(userProfile.documentNotifications) && {
          documentNotifications: userProfile.documentNotifications,
        }),
      }

      const updateEmailVerified = isEmailDefined
        ? userProfile.email !== ''
        : undefined

      // Calculate the email status based on the current user profile and the input
      const calculatedEmailStatus = isEmailDefined
        ? userProfile.email
          ? DataStatus.VERIFIED
          : currentUserProfile?.emails?.[0].emailStatus ===
            DataStatus.NOT_VERIFIED
          ? DataStatus.NOT_DEFINED
          : DataStatus.EMPTY
        : (currentUserProfile?.emails?.[0].emailStatus as DataStatus)

      await this.userProfileModel.upsert(
        {
          ...update,
          lastNudge: new Date(),
          nextNudge: addMonths(
            new Date(),
            this.hasUnverifiedOrNotDefinedData({
              email: isEmailDefined
                ? userProfile.email
                : currentUserProfile?.emails?.[0]?.email,
              mobilePhoneNumber: isMobilePhoneNumberDefined
                ? update.mobilePhoneNumber
                : currentUserProfile?.mobilePhoneNumber,
              emailStatus: calculatedEmailStatus,
              emailVerified:
                updateEmailVerified ??
                currentUserProfile?.emails?.[0].emailStatus ===
                  DataStatus.VERIFIED,
              mobileStatus:
                update.mobileStatus ??
                (currentUserProfile?.mobileStatus as DataStatus),
              mobilePhoneNumberVerified:
                update.mobilePhoneNumberVerified ??
                currentUserProfile?.mobilePhoneNumberVerified,
            })
              ? SKIP_INTERVAL
              : NUDGE_INTERVAL,
          ),
        },
        { transaction },
      )

      // Find primary email, if it doesn't exist, create it, if it does, update it
      const primaryEmail = await this.emailModel.findOne({
        where: {
          nationalId,
          primary: true,
        },
        transaction,
        useMaster: true,
      })

      if (primaryEmail) {
        // Only update if it has incoming changes
        if (isEmailDefined) {
          await primaryEmail.update({
            email: userProfile.email || null,
            emailStatus: calculatedEmailStatus,
          })
        }
      } else {
        console.log('Creating primary email')
        await this.emailModel.create({
          id: uuid(),
          email: userProfile.email || null,
          primary: true,
          nationalId,
          emailStatus:
            isEmailDefined && userProfile.email
              ? DataStatus.VERIFIED
              : DataStatus.NOT_DEFINED,
        })
      }

      // Update islykill settings
      if (
        isEmailDefined ||
        isMobilePhoneNumberDefined ||
        isDefined(userProfile.emailNotifications)
      ) {
        await this.islykillService.upsertIslykillSettings({
          nationalId,
          phoneNumber: formattedPhoneNumber,
          email: userProfile.email,
          canNudge: userProfile.emailNotifications,
        })
      }
    })

    return this.findById(nationalId, true, ClientType.FIRST_PARTY)
  }

  async getActorProfilesDetails(
    nationalId: string,
  ): Promise<ActorProfileDetailsDto[]> {
    const actorProfiles = await this.actorProfileModel.findAll({
      where: { toNationalId: nationalId },
      include: [
        {
          model: Emails,
          as: 'emails',
        },
      ],
    })

    return actorProfiles.map((actorProfile): ActorProfileDetailsDto => {
      const email = actorProfile.emails || null

      if (!email) {
        return {
          emailStatus: DataStatus.EMPTY,
          email: null,
          needsNudge: null,
          actorNationalId: actorProfile.fromNationalId,
          emailNotifications: actorProfile.emailNotifications,
          emailVerified: false,
        }
      }

      return {
        emailStatus: email.emailStatus,
        email: email.email,
        needsNudge: this.checkNeedsNudge({
          email: email.email,
          emailStatus: email.emailStatus,
          nextNudge: actorProfile.nextNudge,
          shouldValidatePhoneNumber: false,
        }),
        actorNationalId: actorProfile.fromNationalId,
        emailNotifications: actorProfile.emailNotifications,
        emailVerified: email.emailStatus === DataStatus.VERIFIED,
      }
    })
  }

  async createEmailVerification({
    nationalId,
    email,
  }: {
    nationalId: string
    email: string
  }) {
    if (!isEmail(email)) {
      throw new BadRequestException('Email is invalid')
    }
    await this.verificationService.createEmailVerification(nationalId, email, 3)
  }

  async createSmsVerification({
    nationalId,
    mobilePhoneNumber,
  }: {
    nationalId: string
    mobilePhoneNumber: string
  }) {
    await this.verificationService.createSmsVerification(
      {
        nationalId,
        mobilePhoneNumber,
      },
      3,
    )
  }

  /**
   * Confirms the nudge for the user
   * Moves the next nudge date to 6 months from now if the user has skipped the overview
   * Moves the next nudge date to 1 month from now if the user has skipped the email or mobile phone number
   * Sets the email and mobile phone number status to empty if the user has skipped the overview, that means the user has seen the nudge and acknowledged that the data is empty
   * Sets the email and mobile phone number status to empty if the user has skipped the email or mobile phone number, that means the user has seen the nudge and acknowledged that the data is empty
   * @param nationalId
   * @param nudgeType
   */
  async confirmNudge(nationalId: string, nudgeType: NudgeType): Promise<void> {
    const date = new Date()

    const currentProfile = await this.userProfileModel.findOne({
      where: { nationalId },
    })

    const upsertPayload = {
      nationalId,
      lastNudge: date,
      nextNudge: addMonths(
        date,
        nudgeType === NudgeType.NUDGE ? NUDGE_INTERVAL : SKIP_INTERVAL,
      ),
      ...(currentProfile?.mobileStatus === DataStatus.NOT_DEFINED &&
        nudgeType === NudgeType.NUDGE && {
          mobileStatus: DataStatus.EMPTY,
        }),
    }

    await this.sequelize.transaction(async (t) => {
      if (!currentProfile) {
        // Creating a new user profile and linking the default email
        await this.userProfileModel.create(
          {
            ...upsertPayload,
            emails: [
              {
                id: uuid(),
                nationalId,
                email: '',
                primary: true,
                emailStatus: DataStatus.EMPTY,
              },
            ],
          },
          {
            transaction: t,
            useMaster: true,
            include: [{ model: Emails, as: 'emails' }],
          },
        )
      } else {
        // Updating existing user profile
        await this.userProfileModel.update(upsertPayload, {
          where: { nationalId },
          transaction: t,
        })

        // Check for existing primary email
        const primaryEmail = await this.emailModel.findOne({
          where: { nationalId, primary: true },
          transaction: t,
          useMaster: true,
        })

        if (!primaryEmail) {
          // Create a default email if one doesn't exist
          await this.emailModel.create(
            {
              id: uuid(),
              nationalId,
              email: '',
              primary: true,
              emailStatus: DataStatus.EMPTY,
            },
            { transaction: t, useMaster: true },
          )
        } else if (
          primaryEmail.emailStatus === DataStatus.NOT_DEFINED &&
          nudgeType === NudgeType.NUDGE
        ) {
          // Update email status if applicable
          await primaryEmail.update(
            { emailStatus: DataStatus.EMPTY },
            { transaction: t },
          )
        }
      }
    })
  }

  /**
   * Sets the specified email as the primary email for the user.
   * Also updates the lastNudge and nextNudge dates on the user profile.
   * @param nationalId The national ID of the user.
   * @param emailId The ID of the email to set as primary.
   * @returns The updated UserProfileDto.
   */
  async setEmailAsPrimary(
    nationalId: string,
    emailId: string,
  ): Promise<UserProfileDto> {
    await this.sequelize.transaction(async (transaction) => {
      // 1. Find the current primary email and set primary=false
      const currentPrimary = await this.emailModel.findOne({
        where: { nationalId, primary: true },
        transaction,
        useMaster: true, // Ensure we read the latest data
      })
      if (currentPrimary && currentPrimary.id !== emailId) {
        await currentPrimary.update({ primary: false }, { transaction })
      }

      // 2. Find the target email and set primary=true
      const newPrimary = await this.emailModel.findOne({
        where: { id: emailId, nationalId },
        transaction,
        useMaster: true,
      })
      if (!newPrimary) {
        throw new BadRequestException(
          `Email with id ${emailId} not found for user.`,
        )
      }
      if (!newPrimary.primary) {
        await newPrimary.update({ primary: true }, { transaction })
      }

      // 3. Update UserProfile nudge dates
      const userProfile = await this.userProfileModel.findOne({
        where: { nationalId },
        transaction,
        useMaster: true,
      })

      if (!userProfile) {
        // This case should ideally not happen if an email exists for the user,
        // but handle defensively.
        // If no profile exists, setting a primary email implies creating one
        // or assuming one should exist. Let's throw for now.
        throw new Error(
          `UserProfile not found for nationalId ${nationalId} during primary email update.`,
        )
      }

      const emailStatus = newPrimary.emailStatus as DataStatus
      const mobileStatus = userProfile?.mobileStatus as DataStatus

      const hasUnverified = this.hasUnverifiedOrNotDefinedData({
        email: newPrimary.email,
        emailStatus: emailStatus,
        emailVerified: emailStatus === DataStatus.VERIFIED,
        mobilePhoneNumber: userProfile.mobilePhoneNumber,
        mobileStatus: mobileStatus,
        mobilePhoneNumberVerified: userProfile.mobilePhoneNumberVerified,
      })

      await userProfile.update(
        {
          lastNudge: new Date(),
          nextNudge: addMonths(
            new Date(),
            hasUnverified ? SKIP_INTERVAL : NUDGE_INTERVAL,
          ),
        },
        { transaction },
      )
    })

    // Return the updated profile
    return this.findById(nationalId, true, ClientType.FIRST_PARTY)
  }

  /* fetch actor profiles (delegation preferences) for each delegation */
  async getActorProfiles(
    toNationalId: string,
  ): Promise<PaginatedActorProfileDto> {
    const incomingDelegations = await this.getIncomingDelegations(toNationalId)

    const emailPreferences = await this.delegationPreference.findAll({
      where: {
        toNationalId,
        fromNationalId: incomingDelegations.data.map((d) => d.fromNationalId),
      },
    })

    const actorProfiles = incomingDelegations.data.map((delegation) => {
      const emailPreference = emailPreferences.find(
        (preference) => preference.fromNationalId === delegation.fromNationalId,
      )

      // return email preference if it exists, otherwise return default true
      return (
        emailPreference?.toDto() ?? {
          fromNationalId: delegation.fromNationalId,
          emailNotifications: true,
        }
      )
    })

    return {
      data: actorProfiles,
      totalCount: actorProfiles.length,
      pageInfo: {
        hasNextPage: false,
      },
    }
  }

  /* Fetch extended actor profile for a specific delegation */
  async getActorProfile({
    toNationalId,
    fromNationalId,
  }: {
    fromNationalId: string
    toNationalId: string
  }): Promise<ActorProfileDto> {
    const incomingDelegation = await this.getIncomingDelegations(toNationalId)

    const delegation = incomingDelegation.data.find(
      (d) => d.fromNationalId === fromNationalId,
    )

    if (!delegation) {
      throw new BadRequestException('delegation does not exist')
    }

    const userProfile = await this.findById(
      toNationalId,
      false,
      ClientType.FIRST_PARTY,
    )

    const emailPreferences = await this.delegationPreference.findOne({
      where: {
        toNationalId,
        fromNationalId,
      },
    })

    return {
      fromNationalId,
      emailNotifications: emailPreferences?.emailNotifications ?? true,
      email: userProfile.email,
      emailVerified: userProfile.emailVerified,
      documentNotifications: userProfile.documentNotifications,
      locale: userProfile.locale,
    }
  }

  async createOrUpdateActorProfile({
    toNationalId,
    fromNationalId,
    emailNotifications,
    emailsId,
  }: {
    toNationalId: string
    fromNationalId: string
    emailNotifications?: boolean
    emailsId?: string
  }): Promise<MeActorProfileDto> {
    const incomingDelegations = await this.getIncomingDelegations(toNationalId)

    // if the delegation does not exist, throw an error
    if (
      !incomingDelegations.data.some((d) => d.fromNationalId === fromNationalId)
    ) {
      throw new NoContentException()
    }

    try {
      // Validate emailsId exists if provided
      if (emailsId) {
        const emailRecord = await this.emailModel.findByPk(emailsId)
        if (!emailRecord) {
          throw new Error(`Email record with ID ${emailsId} does not exist`)
        }
      }

      const [profile] = await this.delegationPreference.upsert({
        toNationalId,
        fromNationalId,
        emailNotifications,
        emailsId,
      })

      return profile.toDto()
    } catch (error) {
      console.log('error', error)
      throw error
    }
  }

  /**
   * Confirms the nudge for an actor profile
   * Moves the next nudge date to 6 months from now if the actor has seen the nudge (NUDGE)
   * Moves the next nudge date to 1 month from now if the actor has skipped the nudge (SKIP_EMAIL)
   * @param toNationalId The National ID of the delegation recipient
   * @param fromNationalId The National ID of the delegation sender
   * @param nudgeType The type of nudge (NUDGE or SKIP_EMAIL)
   */
  async confirmActorProfileNudge({
    toNationalId,
    fromNationalId,
    nudgeType,
  }: {
    toNationalId: string
    fromNationalId: string
    nudgeType: NudgeType
  }): Promise<void> {
    const date = new Date()

    // Verify the delegation exists
    const incomingDelegations = await this.getIncomingDelegations(toNationalId)

    const delegation = incomingDelegations.data.find(
      (d) => d.fromNationalId === fromNationalId,
    )

    if (!delegation) {
      throw new BadRequestException('Delegation does not exist')
    }

    // Get the actor profile
    const actorProfile = await this.actorProfileModel.findOne({
      where: {
        toNationalId,
        fromNationalId,
      },
    })

    if (!actorProfile) {
      throw new BadRequestException('Actor profile does not exist')
    }

    // Update the nextNudge date based on nudge type
    await actorProfile.update({
      lastNudge: date,
      nextNudge: addMonths(
        date,
        nudgeType === NudgeType.NUDGE ? NUDGE_INTERVAL : SKIP_INTERVAL,
      ),
    })
  }

  /* Fetch single actor profile with additional details for the specified delegation */
  async getSingleActorProfile({
    toNationalId,
    fromNationalId,
  }: {
    toNationalId: string
    fromNationalId: string
  }): Promise<ActorProfileDetailsDto> {
    // Get actor profile (delegation preferences)
    const actorProfile = await this.actorProfileModel.findOne({
      where: {
        toNationalId,
        fromNationalId,
      },
    })

    if (!actorProfile) {
      throw new BadRequestException('Actor profile does not exist')
    }

    let email = null
    let emailStatus = DataStatus.NOT_DEFINED

    if (actorProfile.emailsId) {
      const emailByActorId = await this.emailModel.findOne({
        where: { id: actorProfile.emailsId },
      })

      if (emailByActorId) {
        email = emailByActorId.email
        emailStatus = emailByActorId.emailStatus
      }
    }

    // Get the user name for the actor by using the national id

    return {
      email,
      emailStatus,
      emailVerified: emailStatus === DataStatus.VERIFIED,
      needsNudge: this.checkNeedsNudge({
        email,
        emailStatus,
        nextNudge: actorProfile.nextNudge,
        shouldValidatePhoneNumber: false,
      }),
      actorNationalId: fromNationalId,
      emailNotifications: actorProfile.emailNotifications,
    }
  }

  /**
   * Updates or creates an actor profile with email information
   * If the email exists in the emails table and emailVerificationCode is valid,
   * it updates the existing emails table row, otherwise creates a new Emails row.
   * Always updates actor profiles email_id and nudge.
   */
  async updateActorProfileEmail({
    toNationalId,
    fromNationalId,
    email,
    emailVerificationCode,
    emailNotifications,
  }: {
    toNationalId: string
    fromNationalId: string
    email?: string
    emailVerificationCode?: string
    emailNotifications?: boolean
  }): Promise<ActorProfileEmailDto> {
    let emailRecord: Emails | null = null
    let emailStatus = DataStatus.NOT_DEFINED

    await this.sequelize.transaction(async (transaction) => {
      // Look for existing email
      if (isDefined(email)) {
        // Empty email strings should be rejected
        if (email === '') {
          throw new BadRequestException('Email cannot be empty string')
        }

        // Check if email and verification code are both provided
        const shouldVerifyEmail = email !== ''

        if (shouldVerifyEmail && !isDefined(emailVerificationCode)) {
          throw new BadRequestException('Email verification code is required')
        }

        // If verifying email, validate the code
        if (shouldVerifyEmail) {
          const { confirmed, message, remainingAttempts } =
            await this.verificationService.confirmEmail(
              {
                email,
                hash: emailVerificationCode!,
              },
              fromNationalId,
              { transaction, maxTries: 3 },
            )

          if (!confirmed) {
            // Check if we should throw a BadRequest or an AttemptFailed error
            if (remainingAttempts && remainingAttempts >= 0) {
              throw new AttemptFailed(remainingAttempts, {
                emailVerificationCode: 'Verification code does not match.',
              })
            } else {
              throw new BadRequestException(message)
            }
          }

          emailStatus = DataStatus.VERIFIED
        }

        // Check if the email exists in the emails table
        emailRecord = await this.emailModel.findOne({
          where: {
            email,
          },
          transaction,
          useMaster: true,
        })

        if (emailRecord) {
          // Update existing email record if verification was successful
          if (shouldVerifyEmail) {
            await emailRecord.update(
              { emailStatus: DataStatus.VERIFIED },
              { transaction },
            )
          }
        } else {
          // Create new email record if it doesn't exist
          emailRecord = await this.emailModel.create(
            {
              id: uuid(),
              email,
              primary: false,
              nationalId: fromNationalId,
              emailStatus: shouldVerifyEmail
                ? DataStatus.VERIFIED
                : DataStatus.NOT_VERIFIED,
            },
            { transaction, useMaster: true },
          )
        }
      }

      // Get or create the actor profile
      const [actorProfile] = await this.actorProfileModel.findOrCreate({
        where: {
          toNationalId,
          fromNationalId,
        },
        defaults: {
          toNationalId,
          fromNationalId,
          emailNotifications: emailNotifications ?? true,
          lastNudge: new Date(),
          nextNudge: addMonths(new Date(), NUDGE_INTERVAL),
          emailsId: emailRecord?.id,
        },
        transaction,
        useMaster: true,
      })

      // Update actor profile if it exists
      if (actorProfile) {
        const updateData: Partial<ActorProfile> = {
          lastNudge: new Date(),
          nextNudge: addMonths(new Date(), NUDGE_INTERVAL),
        }

        if (isDefined(emailNotifications)) {
          updateData.emailNotifications = emailNotifications
        }

        if (emailRecord) {
          updateData.emailsId = emailRecord.id
        }

        await actorProfile.update(updateData, { transaction })
      }
    })

    // Return the updated actor profile
    const actorProfile = await this.actorProfileModel.findOne({
      where: {
        toNationalId,
        fromNationalId,
      },
    })

    // Use type assertion for emailRecord
    const typedEmailRecord = emailRecord as unknown as { email?: string | null }
    const emailStr = typedEmailRecord?.email || ''

    const result = {
      email: emailStr,
      emailStatus,
      needsNudge: false, // Reset nudge status since we just updated
      actorNationalId: toNationalId,
      emailNotifications: actorProfile?.emailNotifications ?? true,
    }
    return result
  }

  /**
   * Sets the specified email ID on an actor profile and resets the nudge timer
   * @param toNationalId The national ID of the delegation recipient
   * @param fromNationalId The national ID of the delegation sender
   * @param emailsId The ID of the email to set on the actor profile
   * @returns The updated actor profile DTO
   */
  async setActorProfileEmail({
    toNationalId,
    fromNationalId,
    emailsId,
  }: {
    toNationalId: string
    fromNationalId: string
    emailsId: string
  }): Promise<ActorProfileDetailsDto> {
    // Verify the actor profile exists
    const actorProfile = await this.actorProfileModel.findOne({
      where: {
        toNationalId,
        fromNationalId,
      },
    })

    if (!actorProfile) {
      throw new BadRequestException('Actor profile does not exist')
    }

    // Verify the email exists
    const emailRecord = await this.emailModel.findByPk(emailsId)
    if (!emailRecord) {
      throw new BadRequestException(`Email with ID ${emailsId} not found`)
    }

    if (emailRecord.emailStatus !== DataStatus.VERIFIED) {
      throw new BadRequestException('Email is not verified')
    }

    // Get or create actor profile and update it
    await this.sequelize.transaction(async (transaction) => {
      await actorProfile.update(
        {
          emailsId,
          lastNudge: new Date(),
          nextNudge: addMonths(new Date(), NUDGE_INTERVAL),
        },
        { transaction },
      )
    })

    // Return the updated actor profile details
    return this.getSingleActorProfile({ toNationalId, fromNationalId })
  }

  /* Private methods */

  private async getIncomingDelegations(nationalId: string) {
    return this.delegationsApi.delegationsControllerGetDelegationRecords({
      xQueryNationalId: nationalId,
      scope: DocumentsScope.main,
      direction:
        DelegationsControllerGetDelegationRecordsDirectionEnum.incoming,
    })
  }

  /**
   * Determines if a user needs to be nudged based on contact information and timing.
   *
   * This function evaluates whether a user should receive a notification (nudge) based on:
   * 1. The presence and verification status of their contact information (email and/or phone)
   * 2. The timing of the next scheduled nudge (if specified)
   *
   * The logic works as follows:
   * - If nextNudge date is provided:
   *   - If no contact info exists (no email and no phone), return true if nextNudge is in the past
   *   - If verified contact info exists (verified email or valid phone), return true if nextNudge is in the past
   * - If no nextNudge date is provided:
   *   - If verified contact info exists (verified email or valid phone), return true (immediate nudge)
   *   - Otherwise, return null (no nudge needed)
   * - In all other cases, return null (no nudge needed)
   *
   * Phone validation depends on the shouldValidatePhoneNumber flag:
   * - When true: requires both phone number existence and verification
   * - When false: only requires phone number existence
   *
   * @returns boolean | null - true if nudge is needed, null if not needed or cannot be determined
   */
  private checkNeedsNudge({
    email,
    emailStatus,
    nextNudge,
    mobilePhoneNumber,
    mobilePhoneNumberVerified,
    shouldValidatePhoneNumber = true,
  }: {
    email: string | null | undefined
    emailStatus: DataStatus | null | undefined
    nextNudge: Date | null | undefined
    mobilePhoneNumber?: string | null
    mobilePhoneNumberVerified?: boolean
    shouldValidatePhoneNumber?: boolean
  }): boolean | null {
    const isEmailVerified = emailStatus === DataStatus.VERIFIED
    const isPhoneValid = shouldValidatePhoneNumber
      ? mobilePhoneNumber && mobilePhoneNumberVerified
      : mobilePhoneNumber !== null && mobilePhoneNumber !== undefined

    if (nextNudge) {
      if (!email && !mobilePhoneNumber) {
        return nextNudge < new Date()
      }

      if ((email && isEmailVerified) || isPhoneValid) {
        return nextNudge < new Date()
      }
    } else {
      if ((email && isEmailVerified) || isPhoneValid) {
        return true
      }
    }
    return null
  }

  private hasUnverifiedOrNotDefinedData({
    email,
    mobilePhoneNumber,
    emailVerified,
    mobilePhoneNumberVerified,
    mobileStatus,
    emailStatus,
  }: {
    email?: string | null
    mobilePhoneNumber?: string | null
    emailVerified?: boolean
    mobilePhoneNumberVerified?: boolean
    mobileStatus: DataStatus
    emailStatus: DataStatus
  }): boolean {
    if ((email && !emailVerified) || emailStatus === DataStatus.NOT_DEFINED) {
      // If email exists but isn't verified OR email status is explicitly NOT_DEFINED
      return true
    } else if (
      (mobilePhoneNumber && !mobilePhoneNumberVerified) || // Mobile exists but isn't verified
      mobileStatus === DataStatus.NOT_DEFINED // OR mobile status is explicitly NOT_DEFINED
    ) {
      return true
    } else {
      // Otherwise (email/mobile are verified OR status is EMPTY)
      return false
    }
  }

  /**
   * Checks if the audkenni phone number is the same as the mobile phone number to skip verification
   * @param audkenniSimNumber
   * @param mobilePhoneNumber
   */
  private checkAudkenniSameAsMobilePhoneNumber(
    audkenniSimNumber?: string,
    mobilePhoneNumber?: string,
  ): boolean {
    if (!audkenniSimNumber || !mobilePhoneNumber) {
      return false
    }

    /**
     * Remove dashes from mobile phone number and compare last 7 digits of mobilePhoneNumber with the audkenni Phone number
     * Removing the dashes prevents misreading string with format +354-765-4321 as 65-4321
     */
    return (
      mobilePhoneNumber.replace(/-/g, '').slice(-7) ===
      audkenniSimNumber.replace(/-/g, '').slice(-7)
    )
  }

  filterByClientTypeAndRestrictionDate(
    clientType: ClientType,
    userProfile: UserProfile,
  ): UserProfileDto {
    const isFirstParty = clientType === ClientType.FIRST_PARTY

    let filteredUserProfile: UserProfileDto = {
      nationalId: userProfile.nationalId,
      email: userProfile.emails?.[0].email ?? null,
      mobilePhoneNumber: userProfile.mobilePhoneNumber,
      locale: userProfile.locale,
      mobilePhoneNumberVerified: userProfile.mobilePhoneNumberVerified ?? false,
      emailVerified:
        userProfile.emails?.[0].emailStatus === DataStatus.VERIFIED,
      documentNotifications: userProfile.documentNotifications,
      needsNudge: this.checkNeedsNudge({
        email: userProfile.emails?.[0].email,
        emailStatus: userProfile.emails?.[0].emailStatus,
        nextNudge: userProfile.nextNudge,
        mobilePhoneNumber: userProfile.mobilePhoneNumber,
        mobilePhoneNumberVerified: userProfile.mobilePhoneNumberVerified,
      }),
      emailNotifications: userProfile.emailNotifications,
      lastNudge: userProfile.lastNudge,
      nextNudge: userProfile.nextNudge,
      isRestricted: false,
    }

    if (
      !userProfile.lastNudge ||
      (this.config.migrationDate ?? new Date()) > userProfile.lastNudge
    ) {
      const isEmailVerified =
        userProfile.emails?.[0].emailStatus === DataStatus.VERIFIED

      filteredUserProfile = {
        ...filteredUserProfile,
        email: isFirstParty ? filteredUserProfile.email : null,
        mobilePhoneNumber: isFirstParty ? userProfile.mobilePhoneNumber : null,
        emailVerified: isFirstParty && isEmailVerified,
        mobilePhoneNumberVerified:
          isFirstParty && userProfile.mobilePhoneNumberVerified
            ? userProfile.mobilePhoneNumberVerified
            : false,
        isRestricted: true,
      }
    }

    return filteredUserProfile
  }
}

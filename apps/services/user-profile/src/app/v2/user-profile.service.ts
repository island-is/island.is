import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { isEmail } from 'class-validator'
import addMonths from 'date-fns/addMonths'
import { Op, Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import {
  DelegationsApi,
  DelegationsControllerGetDelegationRecordsDirectionEnum,
} from '@island.is/clients/auth/delegation-api'
import type { ConfigType } from '@island.is/nest/config'
import { AttemptFailed, NoContentException } from '@island.is/nest/problem'
import { isDefined, isSearchTermValid } from '@island.is/shared/utils'

import { DocumentsScope } from '@island.is/auth/scopes'
import { uuid } from 'uuidv4'
import { UserProfileConfig } from '../../config'
import { ClientType } from '../types/ClientType'
import { NudgeType } from '../types/nudge-type'
import { DataStatus } from '../user-profile/types/dataStatusTypes'
import { UserProfile } from '../user-profile/userProfile.model'
import { VerificationService } from '../user-profile/verification.service'
import { formatPhoneNumber } from '../utils/format-phone-number'
import { ActorProfileEmailDto } from './dto/actor-profile-email.dto'
import {
  ActorProfileDetailsDto,
  ActorProfileDto,
  MeActorProfileDto,
  PaginatedActorProfileDto,
} from './dto/actor-profile.dto'
import { PaginatedUserProfileDto } from './dto/paginated-user-profile.dto'
import { PatchUserProfileDto } from './dto/patch-user-profile.dto'
import { UserProfileDto } from './dto/user-profile.dto'
import { ActorProfile } from './models/actor-profile.model'
import { Emails } from './models/emails.model'
import kennitala from 'kennitala'

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
          required: false,
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
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              email: userProfile.email!,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              mobilePhoneNumber: userProfile.mobilePhoneNumber!,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
          required: false,
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
          : currentUserProfile?.emails?.[0]?.emailStatus ===
            DataStatus.NOT_VERIFIED
          ? DataStatus.NOT_DEFINED
          : DataStatus.EMPTY
        : (currentUserProfile?.emails?.[0]?.emailStatus as DataStatus) ||
          DataStatus.EMPTY

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
                currentUserProfile?.emails?.[0]?.emailStatus ===
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

      // Now lets check if the email is already in the database
      if (isEmailDefined) {
        // Lets find the primary email and set it it to false
        const primaryEmail = await this.emailModel.findOne({
          where: {
            nationalId,
            primary: true,
          },
          transaction,
          useMaster: true,
        })

        if (primaryEmail) {
          // Set the primary email to false
          await primaryEmail.update({ primary: false }, { transaction })
        }

        if (isEmailDefined && userProfile.email !== '') {
          const email = await this.emailModel.findOne({
            where: {
              email: userProfile.email,
              nationalId,
            },
            transaction,
            useMaster: true,
          })

          if (email) {
            await email.update(
              {
                primary: true,
                emailStatus: calculatedEmailStatus,
              },
              { transaction },
            )
          } else {
            // This is a workaround to ensure that the primary email is created after the user profile is created
            await this.emailModel.create(
              {
                id: uuid(),
                email: userProfile.email || null,
                primary: true,
                nationalId,
                emailStatus:
                  isEmailDefined && userProfile.email
                    ? DataStatus.VERIFIED
                    : DataStatus.NOT_DEFINED,
              },
              { transaction },
            )
          }
        }
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
          nationalId: actorProfile.fromNationalId,
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
        nationalId: actorProfile.fromNationalId,
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

  async findOrCreateUserProfile(nationalId: string, transaction?: Transaction) {
    // Check if nationalId is valid
    if (!kennitala.isValid(nationalId)) {
      throw new BadRequestException('Invalid national ID')
    }

    // Check if user profile already exists
    const userProfile = await this.userProfileModel.findOne({
      where: { nationalId },
      transaction,
      useMaster: true,
    })

    if (userProfile) {
      return userProfile
    }

    return await this.userProfileModel
      .create(
        {
          nationalId,
          email: '',
          emailStatus: DataStatus.EMPTY,
        },
        { transaction, useMaster: true },
      )
      .catch((error) => {
        console.log('Error creating user profile', error)
        throw error
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

      // 3. Check if email is verified before setting as primary
      if (newPrimary.emailStatus !== DataStatus.VERIFIED) {
        throw new BadRequestException(
          'Cannot set unverified email as primary email',
        )
      }

      // 4. Set the email as primary
      if (!newPrimary.primary) {
        await newPrimary.update({ primary: true }, { transaction })
      }

      // 5. Update UserProfile nudge dates
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

    // Filter out duplicate delegations
    incomingDelegations.data = incomingDelegations.data.filter(
      (delegation, index, self) =>
        index ===
        self.findIndex(
          (d) =>
            d.fromNationalId === delegation.fromNationalId &&
            d.toNationalId === delegation.toNationalId,
        ),
    )

    const emailPreferences = await this.delegationPreference.findAll({
      where: {
        toNationalId,
        fromNationalId: incomingDelegations.data.map((d) => d.fromNationalId),
      },
      include: [
        {
          model: Emails,
          as: 'emails',
          attributes: ['email', 'emailStatus'],
        },
      ],
    })

    const actorProfiles = await Promise.all(
      incomingDelegations.data.map(async (delegation) => {
        const emailPreference = emailPreferences.find(
          (preference) =>
            preference.fromNationalId === delegation.fromNationalId,
        )

        if (!emailPreference) {
          const userProfile = await this.findById(
            delegation.fromNationalId,
            true,
            ClientType.FIRST_PARTY,
          )
          return {
            fromNationalId: delegation.fromNationalId,
            emailNotifications: true,
            email: userProfile.email,
            emailVerified: userProfile.emailVerified,
          }
        }

        return emailPreference?.toDto()
      }),
    )

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
      include: [
        {
          model: Emails,
          as: 'emails',
          attributes: ['email', 'emailStatus'],
        },
      ],
    })

    const actorProfile = {
      fromNationalId,
      ...(emailPreferences
        ? {
            emailNotifications: emailPreferences.emailNotifications,
            email: emailPreferences.emails?.email,
            emailVerified:
              emailPreferences.emails?.emailStatus === DataStatus.VERIFIED,
          }
        : {
            emailNotifications: true,
            email: userProfile.email,
            emailVerified: userProfile.emailVerified,
          }),
      documentNotifications: userProfile.documentNotifications,
      locale: userProfile.locale,
    }

    return actorProfile
  }

  /**
   * Creates or updates an actor profile with the specified preferences
   * @param toNationalId - The national ID of the delegation recipient
   * @param fromNationalId - The national ID of the delegation sender
   * @param emailNotifications - Optional flag to enable/disable email notifications
   * @param emailsId - Optional ID of the email record to associate with the profile
   * @returns Promise<MeActorProfileDto> - The created/updated actor profile
   * @throws NoContentException if delegation doesn't exist
   * @throws Error if email record doesn't exist or profile creation fails
   */
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
    // Verify delegation exists
    const incomingDelegations = await this.getIncomingDelegations(toNationalId)
    const delegationExists = incomingDelegations.data.some(
      (d) => d.fromNationalId === fromNationalId,
    )

    if (!delegationExists) {
      throw new NoContentException()
    }

    // Initialize email-related variables
    let email = null
    let emailStatus = DataStatus.NOT_DEFINED

    try {
      // If emailsId provided, validate and get email details
      if (emailsId) {
        const emailRecord = await this.emailModel.findByPk(emailsId)
        if (!emailRecord) {
          throw new Error(`Email record with ID ${emailsId} does not exist`)
        }

        email = emailRecord.email
        emailStatus = emailRecord.emailStatus
      }

      // Create or update the actor profile
      const [profile] = await this.delegationPreference.upsert({
        toNationalId,
        fromNationalId,
        emailNotifications,
        emailsId,
      })

      if (!profile) {
        throw new Error(
          'Actor profile does not exist, and could not be created',
        )
      }

      // Return the updated profile details
      return {
        fromNationalId,
        emailNotifications: emailNotifications ?? true,
        email,
        emailsId: profile.emailsId,
        emailVerified: emailStatus === DataStatus.VERIFIED,
      } as MeActorProfileDto
    } catch (error) {
      // Log and rethrow any errors
      console.error('Error in createOrUpdateActorProfile:', error)
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
    const [actorProfile] = await this.actorProfileModel.findOrCreate({
      where: {
        toNationalId,
        fromNationalId,
      },
      defaults: {
        toNationalId,
        fromNationalId,
        emailNotifications: true,
        lastNudge: date,
        nextNudge: addMonths(
          date,
          nudgeType === NudgeType.NUDGE ? NUDGE_INTERVAL : SKIP_INTERVAL,
        ),
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
    const incomingDelegations = await this.getIncomingDelegations(toNationalId)

    // Check if this delegation exists
    const delegation = incomingDelegations.data.find(
      (d) => d.fromNationalId === fromNationalId,
    )

    if (!delegation) {
      throw new BadRequestException('Delegation does not exist')
    }

    // Get actor profile (delegation preferences)
    const actorProfile = await this.actorProfileModel.findOne({
      where: {
        toNationalId,
        fromNationalId,
      },
    })

    if (actorProfile) {
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
        nationalId: fromNationalId,
        emailNotifications: actorProfile.emailNotifications,
      }
    }

    // If the actor profile does not exist, return a default actor profile with user profile email
    const userProfile = await this.findById(
      toNationalId,
      true,
      ClientType.FIRST_PARTY,
    )

    return {
      email: userProfile.email,
      emailStatus: userProfile.emailVerified
        ? DataStatus.VERIFIED
        : DataStatus.NOT_VERIFIED,
      emailVerified: userProfile.emailVerified,
      needsNudge: null,
      nationalId: fromNationalId,
      emailNotifications: true,
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
    // Verify the delegation exists first
    const incomingDelegations = await this.getIncomingDelegations(toNationalId)
    const delegation = incomingDelegations.data.find(
      (d) => d.fromNationalId === fromNationalId,
    )

    if (!delegation) {
      throw new BadRequestException('Delegation does not exist')
    }

    let emailRecord: Emails | null = null
    let emailStatus = DataStatus.NOT_DEFINED

    return await this.sequelize.transaction(async (transaction) => {
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
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                hash: emailVerificationCode!,
              },
              toNationalId,
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
            nationalId: toNationalId,
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
              nationalId: toNationalId,
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
      } else {
        throw new InternalServerErrorException(
          'Actor profile does not exist and could not be created',
        )
      }

      return {
        emailsId: emailRecord?.id ?? '',
        email: emailRecord?.email ?? '',
        emailStatus,
        needsNudge: false,
        nationalId: fromNationalId,
        emailNotifications: actorProfile.emailNotifications ?? true,
      } as ActorProfileEmailDto
    })
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
    // Verify the delegation exists
    const incomingDelegations = await this.getIncomingDelegations(toNationalId)
    const delegation = incomingDelegations.data.find(
      (d) => d.fromNationalId === fromNationalId,
    )

    if (!delegation) {
      throw new BadRequestException('Delegation does not exist')
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
      const [actorProfile] = await this.actorProfileModel.findOrCreate({
        where: {
          toNationalId,
          fromNationalId,
        },
        defaults: {
          toNationalId,
          fromNationalId,
          emailNotifications: true,
          lastNudge: new Date(),
          nextNudge: addMonths(new Date(), NUDGE_INTERVAL),
          emailsId,
        },
        transaction,
        useMaster: true,
      })

      if (actorProfile) {
        await actorProfile.update(
          {
            emailsId,
            lastNudge: new Date(),
            nextNudge: addMonths(new Date(), NUDGE_INTERVAL),
          },
          { transaction },
        )
      }
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
    // If emailStatus is undefined, we can't consider the email verified
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
      email: userProfile.emails?.[0]?.email ?? null,
      mobilePhoneNumber: userProfile.mobilePhoneNumber,
      locale: userProfile.locale,
      mobilePhoneNumberVerified: userProfile.mobilePhoneNumberVerified ?? false,
      emailVerified:
        userProfile.emails?.[0]?.emailStatus === DataStatus.VERIFIED,
      documentNotifications: userProfile.documentNotifications,
      needsNudge: this.checkNeedsNudge({
        email: userProfile.emails?.[0]?.email,
        emailStatus: userProfile.emails?.[0]?.emailStatus,
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
        userProfile.emails?.[0]?.emailStatus === DataStatus.VERIFIED

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

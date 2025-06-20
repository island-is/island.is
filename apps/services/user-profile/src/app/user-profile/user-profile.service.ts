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

import { VerificationService } from './verification.service'
import { UserProfile } from './models/userProfile.model'
import { formatPhoneNumber } from './utils/format-phone-number'
import { PatchUserProfileDto } from './dto/patch-user-profile.dto'
import { UserProfileDto } from './dto/user-profile.dto'
import { DataStatus } from './types/dataStatusTypes'
import { NudgeType } from '../types/nudge-type'
import { PaginatedUserProfileDto } from './dto/paginated-user-profile.dto'
import { ClientType } from '../types/ClientType'
import { UserProfileConfig } from '../../config'
import { ActorProfile } from './models/actor-profile.model'
import {
  ActorProfileDto,
  MeActorProfileDto,
  PaginatedActorProfileDto,
} from './dto/actor-profile.dto'
import { DocumentsScope } from '@island.is/auth/scopes'

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
  ) {}

  async findAllBySearchTerm(search: string): Promise<PaginatedUserProfileDto> {
    // Validate search term
    if (!isSearchTermValid(search)) {
      throw new BadRequestException('Invalid search term')
    }

    const userProfiles = await this.userProfileModel.findAll({
      where: {
        [Op.or]: [
          { nationalId: search },
          { email: search },
          { mobilePhoneNumber: search },
        ],
      },
    })

    const userProfileDtos = userProfiles.map((userProfile) => ({
      nationalId: userProfile.nationalId,
      email: userProfile.email,
      mobilePhoneNumber: userProfile.mobilePhoneNumber,
      locale: userProfile.locale,
      mobilePhoneNumberVerified: userProfile.mobilePhoneNumberVerified ?? false,
      emailVerified: userProfile.emailVerified ?? false,
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
              email: userProfile.email ?? '',
              hash: userProfile.emailVerificationCode ?? '',
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
              mobilePhoneNumber: userProfile.mobilePhoneNumber ?? '',
              code: userProfile.mobilePhoneNumberVerificationCode ?? '',
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
        where: { nationalId },
        transaction,
        useMaster: true,
      })

      const update = {
        nationalId,
        ...(isEmailDefined && {
          email: userProfile.email || null,
          emailVerified: userProfile.email !== '',
          emailStatus: userProfile.email
            ? DataStatus.VERIFIED
            : currentUserProfile?.emailStatus === DataStatus.NOT_VERIFIED
            ? DataStatus.NOT_DEFINED
            : DataStatus.EMPTY,
        }),
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

      await this.userProfileModel.upsert(
        {
          ...update,
          lastNudge: new Date(),
          nextNudge: addMonths(
            new Date(),
            this.hasUnverifiedOrNotDefinedData({
              email: isEmailDefined ? update.email : currentUserProfile?.email,
              mobilePhoneNumber: isMobilePhoneNumberDefined
                ? update.mobilePhoneNumber
                : currentUserProfile?.mobilePhoneNumber,
              emailStatus:
                update.emailStatus ??
                (currentUserProfile?.emailStatus as DataStatus),
              mobileStatus:
                update.mobileStatus ??
                (currentUserProfile?.mobileStatus as DataStatus),
              emailVerified:
                update.emailVerified ?? currentUserProfile?.emailVerified,
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
    })

    return this.findById(nationalId, true, ClientType.FIRST_PARTY)
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
      where: {
        nationalId,
      },
    })

    await this.userProfileModel.upsert({
      nationalId,
      lastNudge: date,
      nextNudge: addMonths(
        date,
        nudgeType === NudgeType.NUDGE ? NUDGE_INTERVAL : SKIP_INTERVAL,
      ),
      ...(currentProfile?.emailStatus === DataStatus.NOT_DEFINED &&
        nudgeType === NudgeType.NUDGE && {
          emailStatus: DataStatus.EMPTY,
        }),
      ...(currentProfile?.mobileStatus === DataStatus.NOT_DEFINED &&
        nudgeType === NudgeType.NUDGE && {
          mobileStatus: DataStatus.EMPTY,
        }),
    })
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
  }: {
    toNationalId: string
    fromNationalId: string
    emailNotifications: boolean
  }): Promise<MeActorProfileDto> {
    const incomingDelegations = await this.getIncomingDelegations(toNationalId)

    // if the delegation does not exist, throw an error
    if (
      !incomingDelegations.data.some((d) => d.fromNationalId === fromNationalId)
    ) {
      throw new NoContentException()
    }

    const [profile] = await this.delegationPreference.upsert({
      toNationalId,
      fromNationalId,
      emailNotifications,
    })

    return profile.toDto()
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

  private checkNeedsNudge(userProfile: UserProfile): boolean | null {
    if (userProfile.nextNudge) {
      if (!userProfile.email && !userProfile.mobilePhoneNumber) {
        return userProfile.nextNudge < new Date()
      }

      if (
        (userProfile.email && userProfile.emailVerified) ||
        (userProfile.mobilePhoneNumber && userProfile.mobilePhoneNumberVerified)
      ) {
        return userProfile.nextNudge < new Date()
      }
    } else {
      if (
        (userProfile.email && userProfile.emailVerified) ||
        (userProfile.mobilePhoneNumber && userProfile.mobilePhoneNumberVerified)
      ) {
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
      return true
    } else if (
      (mobilePhoneNumber && !mobilePhoneNumberVerified) ||
      mobileStatus === DataStatus.NOT_DEFINED
    ) {
      return true
    } else {
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
      email: userProfile.email,
      mobilePhoneNumber: userProfile.mobilePhoneNumber,
      locale: userProfile.locale,
      mobilePhoneNumberVerified: userProfile.mobilePhoneNumberVerified ?? false,
      emailVerified: userProfile.emailVerified ?? false,
      documentNotifications: userProfile.documentNotifications,
      needsNudge: this.checkNeedsNudge(userProfile),
      emailNotifications: userProfile.emailNotifications,
      lastNudge: userProfile.lastNudge,
      nextNudge: userProfile.nextNudge,
      isRestricted: false,
    }

    if (
      !userProfile.lastNudge ||
      (this.config.migrationDate ?? new Date()) > userProfile.lastNudge
    ) {
      filteredUserProfile = {
        ...filteredUserProfile,
        email: isFirstParty ? userProfile.email : null,
        mobilePhoneNumber: isFirstParty ? userProfile.mobilePhoneNumber : null,
        emailVerified:
          isFirstParty && userProfile.emailVerified
            ? userProfile.emailVerified
            : false,
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

import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { UserProfileApi } from '@island.is/clients/user-profile'
import { IslyklarApi } from '@island.is/clients/islykill'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../..'
import { TemplateApiModuleActionProps } from '../../../../types'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import differenceInMonths from 'date-fns/differenceInMonths'

export const MAX_OUT_OF_DATE_MONTHS = 6

const handleError = (error: any) => {
  logger.error(JSON.stringify(error))
  throw new Error(`Failed to resolve request (${error.status})`)
}

enum DataStatus {
  NOT_DEFINED = 'NOT_DEFINED',
  NOT_VERIFIED = 'NOT_VERIFIED',
  VERIFIED = 'VERIFIED',
  EMPTY = 'EMPTY',
}

@Injectable()
export class UserProfileService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly userProfileApi: UserProfileApi,
    private readonly islyklarApi: IslyklarApi,
  ) { }

  userProfileApiWithAuth(auth: Auth): UserProfileApi {
    return this.userProfileApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getIslykillProfile(auth: Auth) {
    if (auth.nationalId === undefined) {
      return null
    }

    this.islyklarApi.islyklarGet({ ssn: auth.nationalId })
      .then(islyklarData => {
        return {
          nationalId: auth.nationalId,
          emailVerified: false,
          mobilePhoneNumberVerified: false,
          documentNotifications: false,
          emailStatus: DataStatus.NOT_VERIFIED,
          mobileStatus: DataStatus.NOT_VERIFIED,

          // Islyklar data:
          mobilePhoneNumber: islyklarData?.mobile,
          email: islyklarData?.email,
          canNudge: islyklarData?.canNudge,
          bankInfo: islyklarData?.bankInfo,
        }
      }).catch(error => {
        if (isRunningOnEnvironment('local')) {
          return null
        }

        logger.error(JSON.stringify(error))
        return null
      })
  }

  async getUserProfileStatus(auth: Auth) {
    /**
     * this.getUserProfile can be a bit slower with the addition of islyklar data call.
     * getUserProfileStatus can be used for a check if the userprofile exists, or if the userdata is old
     * Old userdata can mean a user will be prompted to verify their info in the UI.
     */
    if (auth.nationalId === undefined) {
      return null
    }

    this.userProfileApiWithAuth(auth)
      .userProfileControllerFindOneByNationalId({ nationalId: auth.nationalId })
      .then(profile => {
        /**
         * If user has empty email or tel data
         * Then the user will be prompted every 6 months (MAX_OUT_OF_DATE_MONTHS)
         * to verify if they want to keep their info empty
         */
        const emptyMail = profile?.emailStatus === 'EMPTY'
        const emptyMobile = profile?.mobileStatus === 'EMPTY'
        const modifiedProfileDate = profile?.modified
        const dateNow = new Date()
        const dateModified = new Date(modifiedProfileDate)
        const diffInMonths = differenceInMonths(dateNow, dateModified)
        const diffOutOfDate = diffInMonths >= MAX_OUT_OF_DATE_MONTHS
        const outOfDateEmailMobile = (emptyMail || emptyMobile) && diffOutOfDate

        return {
          hasData: !!modifiedProfileDate,
          hasModifiedDateLate: outOfDateEmailMobile,
        }

      }).catch(error => {
        if (isRunningOnEnvironment('local')) {
          return {
            email: 'mockEmail@island.is',
            mobilePhoneNumber: '9999999',
          }
        }

        if (error.status === 404) {
          return {
            hasData: false,
            hasModifiedDateLate: true,
          }
        }
        handleError(error)
      })
  }

  async getUserProfile({ auth }: TemplateApiModuleActionProps) {
    Promise.all([
      this.userProfileApiWithAuth(auth)
        .userProfileControllerFindOneByNationalId({ nationalId: auth.nationalId }),
      this.islyklarApi.islyklarGet({ ssn: auth.nationalId })
    ]).then(results => {
      const profile = results[0]
      const islyklarData = results[1]
      return {
        ...profile,
        // Temporary solution while we still run the old user profile service.
        mobilePhoneNumber: islyklarData?.mobile,
        email: islyklarData?.email,
        canNudge: islyklarData?.canNudge,
        bankInfo: islyklarData?.bankInfo,
      }
    }).catch((error) => {
      if (isRunningOnEnvironment('local')) {
        return null
      }

      if (error.status === 404) {
        /**
         * Even if userProfileApiWithAuth does not exist.
         * Islykill data might exist for the user, so we need to get that, with default values in the userprofile data.
         */
        return this.getIslykillProfile(auth)
      }
      handleError(error)
    })
  }
}

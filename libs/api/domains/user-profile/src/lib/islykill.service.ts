import { IslyklarApi, PublicUser } from '@island.is/clients/islykill'
import { Injectable, BadRequestException } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'

import { IslykillSettings } from './models/islykillSettings.model'
import { UpdateIslykillSettings } from './models/updateIslykillSettings.model'
import { CreateIslykillSettings } from './models/createIslykillSettings.model'

@Injectable()
export class IslykillService {
  constructor(private readonly islyklarApi: IslyklarApi) {}

  async updateIslykillSettings(
    nationalId: User['nationalId'],
    {
      email,
      mobile,
      canNudge,
      bankInfo,
    }: {
      email?: string
      mobile?: string
      canNudge?: boolean
      bankInfo?: string
    },
  ): Promise<UpdateIslykillSettings> {
    const inputUserData: PublicUser = {
      ssn: nationalId,
      email,
      mobile,
      bankInfo,
      ...(canNudge !== undefined && { canNudge }),
    }
    const errorMsg = 'Unable to update islykill settings for user'

    const existingUser = await this.getIslykillSettings(nationalId)

    if (existingUser.noUserFound) {
      // Create user first if they don't exist
      return this.createIslykillSettings(nationalId, {
        bankInfo,
      })
    } else {
      return this.islyklarApi
        .islyklarPut({
          user: inputUserData,
        })
        .then(() => {
          return {
            nationalId,
            valid: true,
          }
        })
        .catch((e) => {
          throw new BadRequestException(e, errorMsg)
        })
    }
  }

  async getIslykillSettings(
    nationalId: User['nationalId'],
  ): Promise<IslykillSettings> {
    const errorMsg = 'Unable to lookup islykill settings for user'
    const apiData = await this.islyklarApi
      .islyklarGet({
        ssn: nationalId,
      })
      .then((userData: PublicUser) => {
        return {
          nationalId,
          email: userData.email,
          mobile: userData.mobile,
          bankInfo: userData.bankInfo,
          lastLogin: userData.lastLogin,
          nextLastLogin: userData.nextLastLogin,
          lastPassChange: userData.lastPassChange,
          canNudge: userData.canNudge,
          onlyCert: userData.onlyCert,
          nudgeLastAsked: userData.nudgeLastAsked,
        }
      })
      .catch((e) => {
        if (e.status === 404) {
          return {
            nationalId,
            noUserFound: true,
          }
        }
        throw new BadRequestException(e, errorMsg)
      })
    return apiData
  }

  async createIslykillSettings(
    nationalId: User['nationalId'],
    userData: Pick<PublicUser, 'email' | 'mobile' | 'bankInfo'>,
  ): Promise<CreateIslykillSettings> {
    const errorMsg = 'Unable to create islykill settings for user'
    const apiData = await this.islyklarApi
      .islyklarPost({
        user: {
          ssn: nationalId,
          ...userData,
        },
      })
      .then(() => {
        return {
          nationalId,
          valid: true,
        }
      })
      .catch((e) => {
        throw new BadRequestException(e, errorMsg)
      })
    return apiData
  }

  /*
    THIS SERVICE IS NOT AVAILABLE YET.
    KEEPING IN WHILE THIS IS STILL BEING DEVELOPED.
   */
  async deleteIslykillSettings(_nationalId: User['nationalId']) {
    // try {
    //   await this.islyklarApi.islyklarDelete({ ssn: nationalId })
    // } catch (e) {
    // throw new BadRequestException(e, 'Unable to delete islykill settings for user')
    //   return {
    //     nationalId,
    //     valid: false,
    //   }
    // }

    return null
  }
}

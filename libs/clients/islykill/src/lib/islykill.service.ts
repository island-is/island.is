import { IslyklarApi, PublicUser } from '../../gen/fetch'
import { logger } from '@island.is/logging'
import { Injectable, BadRequestException } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'

import { IslykillSettings } from './models/islykillSettings.model'
import { UpdateIslykillSettings } from './models/updateIslykillSettings.model'
import { CreateIslykillSettings } from './models/createIslykillSettings.model'

const LOG_CATEGORY = 'islykill-service'

const handleLogging = (error: any) => {
  logger.error('Islykill error', {
    error: JSON.stringify(error),
    category: LOG_CATEGORY,
  })
}

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
    const apiData = await this.islyklarApi
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
        handleLogging({ e, message: errorMsg, status: e.status })
        throw new BadRequestException(e, errorMsg)
      })
    return apiData
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
            empty: true,
          }
        }
        handleLogging({ e, message: errorMsg, status: e.status })
        throw new BadRequestException(e, errorMsg)
      })
    return apiData
  }

  async createIslykillSettings(
    nationalId: User['nationalId'],
    { email, mobile }: { email?: string; mobile?: string },
  ): Promise<CreateIslykillSettings> {
    const inputUserData: PublicUser = {
      ssn: nationalId,
      email,
      mobile,
    }

    const errorMsg = 'Unable to create islykill settings for user'
    const apiData = await this.islyklarApi
      .islyklarPost({
        user: inputUserData,
      })
      .then(() => {
        return {
          nationalId,
          valid: true,
        }
      })
      .catch((e) => {
        handleLogging({ e, message: errorMsg, status: e.status })
        throw new BadRequestException(e, errorMsg)
      })
    return apiData
  }
}

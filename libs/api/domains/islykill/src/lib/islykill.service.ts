import { IslyklarApi, PublicUser } from '@island.is/clients/islykill'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'

import { IslykillSettings, IslykillUpdateResponse } from './islykill.type'

@Injectable()
export class IslykillService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly islyklarApi: IslyklarApi,
  ) {}

  async updateIslykillSettings(
    nationalId: User['nationalId'],
    { email }: { email: string },
  ): Promise<IslykillUpdateResponse> {
    const inputUserData: PublicUser = {
      ssn: nationalId,
      email,

      // TODO this should be optional
      canNudge: false,
      onlyCert: false,
    }

    try {
      // TODO this should be a possible ErrorResult from the service but something is wrong with
      // how the swagger is setup?
      await this.islyklarApi.islyklarPut({ user: inputUserData })
    } catch (e) {
      this.logger.error('Unable to update islykill settings for user', {
        category: 'islykill-settings',
        nationalId,
        exception: e,
      })
      return {
        nationalId,
        valid: false,
      }
    }

    // TODO error handling

    return {
      nationalId,
      valid: true,
    }
  }

  async getIslykillSettings(
    nationalId: User['nationalId'],
  ): Promise<IslykillSettings> {
    let userData: PublicUser | undefined
    try {
      userData = await this.islyklarApi.islyklarGet({
        ssn: nationalId,
      })
    } catch (e) {
      this.logger.error('Unable to lookup islykill settings for user', {
        category: 'islykill-settings',
        nationalId,
        exception: e,
      })
      return {
        nationalId,
      }
    }

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
  }

  async createIslykillSettings(
    nationalId: User['nationalId'],
    { email }: { email: string },
  ) {
    const inputUserData: PublicUser = {
      ssn: nationalId,
      email,

      // TODO this should be optional
      canNudge: false,
      onlyCert: false,
    }

    try {
      // TODO this should be a possible ErrorResult from the service but something is wrong with
      // how the swagger is setup?
      await this.islyklarApi.islyklarPost({ user: inputUserData })
    } catch (e) {
      this.logger.error('Unable to create islykill settings for user', {
        category: 'islykill-settings',
        nationalId,
        exception: e,
      })
      return {
        nationalId,
        valid: false,
      }
    }

    // TODO error handling

    return {
      nationalId,
      valid: true,
    }
  }

  async deleteIslykillSettings(nationalId: User['nationalId']) {
    try {
      // TODO this should be a possible ErrorResult from the service but something is wrong with
      // how the swagger is setup?
      await this.islyklarApi.islyklarDelete({ ssn: nationalId })
    } catch (e) {
      this.logger.error('Unable to delete islykill settings for user', {
        category: 'islykill-settings',
        nationalId,
        exception: e,
      })
      return {
        nationalId,
        valid: false,
      }
    }

    // TODO error handling

    return {
      nationalId,
      valid: true,
    }
  }
}

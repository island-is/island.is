import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { IslyklarApi, PublicUser } from '@island.is/clients/islykill'
import { isDefined } from '@island.is/shared/utils'

import { IslyklarUpsertDto } from './dto/islyklar-upsert.dto'

@Injectable()
export class IslykillService {
  constructor(private readonly islyklarApi: IslyklarApi) {}

  private async getIslykillSettings(
    nationalId: string,
  ): Promise<PublicUser & { userNotFound?: boolean }> {
    try {
      const userData: PublicUser = await this.islyklarApi.islyklarGet({
        ssn: nationalId,
      })

      return {
        ssn: nationalId,
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
    } catch (e) {
      const error = e as Error & { status?: number }

      if (error.status === 404) {
        return {
          ssn: nationalId,
          userNotFound: true,
        }
      }

      throw new BadRequestException(
        error.message,
        'Unable to lookup islykill settings for user',
      )
    }
  }

  private async updateIslykillSettings(user: PublicUser): Promise<PublicUser> {
    try {
      return this.islyklarApi.islyklarPut({ user })
    } catch (e) {
      const error = e as Error

      throw new InternalServerErrorException(
        'Unable to update islykill settings for user',
        error.message,
      )
    }
  }

  private async createIslykillSettings(user: PublicUser): Promise<PublicUser> {
    try {
      return this.islyklarApi.islyklarPost({
        user,
      })
    } catch (e) {
      const error = e as Error

      throw new InternalServerErrorException(
        error.message,
        'Unable to create islykill settings for user',
      )
    }
  }

  async upsertIslykillSettings({
    nationalId,
    email,
    phoneNumber,
  }: IslyklarUpsertDto): Promise<PublicUser> {
    const { userNotFound, ...publicUser } = await this.getIslykillSettings(
      nationalId,
    )

    if (userNotFound) {
      return this.createIslykillSettings({
        ssn: nationalId,
        email,
        mobile: phoneNumber,
      })
    } else {
      return this.updateIslykillSettings({
        ...publicUser,
        ...(isDefined(email) && { email }),
        ...(isDefined(phoneNumber) && { mobile: phoneNumber }),
      })
    }
  }
}

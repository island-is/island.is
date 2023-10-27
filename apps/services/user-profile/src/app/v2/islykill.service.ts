import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { IslyklarApi, PublicUser } from '@island.is/clients/islykill'

@Injectable()
export class IslykillService {
  constructor(private readonly islyklarApi: IslyklarApi) {}

  async getIslykillSettings(
    nationalId: string,
  ): Promise<PublicUser & { noUserFound?: boolean }> {
    return await this.islyklarApi
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
        throw new BadRequestException(
          e,
          'Unable to lookup islykill settings for user',
        )
      })
  }

  async updateIslykillSettings({
    nationalId,
    email,
    phoneNumber,
  }: {
    nationalId: string
    email?: string
    phoneNumber?: string
  }): Promise<PublicUser> {
    return this.islyklarApi
      .islyklarPut({
        user: {
          ssn: nationalId,
          ...(email && { email }),
          ...(phoneNumber && { mobile: phoneNumber }),
        },
      })
      .then((publicUser) => publicUser)
      .catch((e: Error) => {
        throw new InternalServerErrorException(
          'Unable to update islykill settings for user',
          e.message,
        )
      })
  }

  async createIslykillSettings(
    nationalId: string,
    { email, mobile }: { email?: string; mobile?: string },
  ): Promise<PublicUser> {
    return await this.islyklarApi
      .islyklarPost({
        user: {
          ssn: nationalId,
          ...(email && { email }),
          ...(mobile && { mobile }),
        },
      })
      .then((user) => {
        return user
      })
      .catch(() => {
        throw new InternalServerErrorException(
          'Unable to create islykill settings for user',
        )
      })
  }

  async upsertIslykillSettings({
    nationalId,
    email,
    phoneNumber,
  }: {
    nationalId: string
    email?: string
    phoneNumber?: string
  }): Promise<PublicUser> {
    const user = await this.getIslykillSettings(nationalId)

    if (user.noUserFound) {
      return await this.createIslykillSettings(nationalId, {
        email,
        mobile: phoneNumber,
      })
    } else {
      return await this.updateIslykillSettings({
        nationalId,
        email,
        phoneNumber,
      })
    }
  }
}

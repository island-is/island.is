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
    } catch ({ status, message }) {
      if (status === 404) {
        return {
          ssn: nationalId,
          noUserFound: true,
        }
      }

      throw new BadRequestException(
        message,
        'Unable to lookup islykill settings for user',
      )
    }
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
    try {
      const user = {
        ssn: nationalId,
        ...(email && { email }),
        ...(phoneNumber && { mobile: phoneNumber }),
      }

      return await this.islyklarApi.islyklarPut({ user })
    } catch ({ message }) {
      throw new InternalServerErrorException(
        'Unable to update islykill settings for user',
        message,
      )
    }
  }

  async createIslykillSettings(
    nationalId: string,
    { email, mobile }: { email?: string; mobile?: string },
  ): Promise<PublicUser> {
    try {
      const user = {
        ssn: nationalId,
        ...(email && { email }),
        ...(mobile && { mobile }),
      }

      return await this.islyklarApi.islyklarPost({ user })
    } catch ({ message }) {
      throw new InternalServerErrorException(
        message,
        'Unable to create islykill settings for user',
      )
    }
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
    const { noUserFound } = await this.getIslykillSettings(nationalId)

    if (noUserFound) {
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

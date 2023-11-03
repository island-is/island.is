import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { IslyklarApi, PublicUser } from '@island.is/clients/islykill'

import { IslayklarUpsertDto } from './dto/islayklar-upsertDto'

@Injectable()
export class IslykillService {
  constructor(private readonly islyklarApi: IslyklarApi) {}

  async getIslykillSettings(
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

  async updateIslykillSettings({
    nationalId,
    email,
    phoneNumber,
    publicUser,
  }: IslayklarUpsertDto): Promise<PublicUser> {
    try {
      const user = {
        ...publicUser,
        ssn: nationalId,
        ...(email !== undefined && { email }),
        ...(phoneNumber !== undefined && { mobile: phoneNumber }),
      }

      return this.islyklarApi.islyklarPut({ user })
    } catch (e) {
      const error = e as Error

      throw new InternalServerErrorException(
        'Unable to update islykill settings for user',
        error.message,
      )
    }
  }

  async createIslykillSettings({
    nationalId,
    email,
    phoneNumber,
    publicUser,
  }: IslayklarUpsertDto): Promise<PublicUser> {
    try {
      const user = {
        ...publicUser,
        ssn: nationalId,
        ...(email === undefined && { email }),
        ...(phoneNumber === undefined && { mobile: phoneNumber }),
      }

      return this.islyklarApi.islyklarPost({ user })
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
  }: IslayklarUpsertDto): Promise<PublicUser> {
    const { userNotFound, ...islyklar } = await this.getIslykillSettings(
      nationalId,
    )

    const islykillSettings = {
      nationalId,
      ...(email !== undefined && { email }),
      ...(phoneNumber !== undefined && { phoneNumber }),
      publicUser: islyklar,
    }

    if (userNotFound) {
      return this.createIslykillSettings({
        nationalId,
        email,
        phoneNumber,
      })
    } else {
      return this.updateIslykillSettings(islykillSettings)
    }
  }
}

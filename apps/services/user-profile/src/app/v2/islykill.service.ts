import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { IslyklarApi, PublicUser } from '@island.is/clients/islykill'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { isDefined } from '@island.is/shared/utils'

import { IslyklarUpsertDto } from './dto/islyklar-upsert.dto'

@Injectable()
export class IslykillService {
  constructor(
    private readonly islyklarApi: IslyklarApi,

    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async getIslykillSettings(
    nationalId: string,
  ): Promise<PublicUser & { userNotFound?: boolean }> {
    try {
      // We need to use return await to handle the error
      return await this.islyklarApi.islyklarGet({
        ssn: nationalId,
      })
    } catch (error) {
      if (error.status === 404) {
        return {
          userNotFound: true,
        }
      }

      this.logger.error('Unable to lookup islykill settings for user', error)

      throw new InternalServerErrorException(
        'Unable to lookup islykill settings for user',
      )
    }
  }

  private async updateIslykillSettings(user: PublicUser): Promise<PublicUser> {
    try {
      // We need to use return await to handle the error
      return await this.islyklarApi.islyklarPut({ user })
    } catch (error) {
      this.logger.error('Unable to update islykill settings for user', error)

      throw new InternalServerErrorException(
        'Unable to update islykill settings for user',
      )
    }
  }

  private async createIslykillSettings(user: PublicUser): Promise<PublicUser> {
    try {
      // We need to use return await to handle the error
      return await this.islyklarApi.islyklarPost({
        user,
      })
    } catch (error) {
      this.logger.error('Unable to create islykill settings for user', error)

      throw new InternalServerErrorException(
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

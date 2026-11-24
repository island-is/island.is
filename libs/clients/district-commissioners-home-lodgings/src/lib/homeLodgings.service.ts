import { Inject, Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { isDefined } from '@island.is/shared/utils'
import { IslandISHeimagistingarApi } from '../../gen/fetch'
import { HomeLodgingDto, mapHomeLodgingDto } from './homeLodgings.dto'

@Injectable()
export class DistrictCommissionersHomeLodgingsService {
  constructor(
    private readonly api: IslandISHeimagistingarApi,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private apiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  async getHomeLodgings(user: User): Promise<HomeLodgingDto[]> {
    const response = await this.apiWithAuth(user)
      .islandISHeimagistingarGetRaw()
      .catch(handle404)

    if (!response) {
      this.logger.debug('IslandISHeimagistingar returned 404')
      return []
    }

    // Debug level only: the response contains addresses, so it must not be
    // logged in production where the level defaults to info. The body is read
    // before the generated client drops fields that are not in the spec.
    this.logger.debug(
      `Raw IslandISHeimagistingar response: ${await response.raw
        .clone()
        .text()}`,
    )

    const homeLodgings = await response.value()
    return homeLodgings.map(mapHomeLodgingDto).filter(isDefined)
  }
}

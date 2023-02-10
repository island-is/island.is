import {
  ClientAllowedCorsOrigin,
  ClientsService,
} from '@island.is/auth-api-lib'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('clients')
@Controller({
  path: 'origins',
  version: ['1', VERSION_NEUTRAL],
})
export class OriginsController {
  constructor(private readonly clientsService: ClientsService) {}

  /** Gets allowed cors origins by origin */
  @Scopes('@identityserver.api/authentication')
  @Get()
  @ApiOkResponse({ type: ClientAllowedCorsOrigin, isArray: true })
  async findAllowedCorsOrigins(
    @Query('origin') origin: string,
  ): Promise<ClientAllowedCorsOrigin[]> {
    if (!origin) {
      throw new BadRequestException('Origin must be provided')
    }

    return this.clientsService.findAllowedCorsOrigins(origin)
  }
}

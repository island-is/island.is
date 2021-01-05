import {
  ClientsService,
  ClientAllowedCorsOriginDTO,
  ClientAllowedCorsOrigin,
} from '@island.is/auth-api-lib'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOAuth2, ApiTags } from '@nestjs/swagger'
import { IdsAuthGuard } from '@island.is/auth-nest-tools'
import { NationalIdGuard } from '../access/national-id-guard'

@ApiOAuth2(['@identityserver.api/read'])
@UseGuards(IdsAuthGuard, NationalIdGuard)
@ApiTags('cors')
@Controller('cors')
export class CorsController {
  constructor(private readonly clientsService: ClientsService) {}

  /** Adds new Cors address */
  @Post()
  @ApiCreatedResponse({ type: ClientAllowedCorsOrigin })
  async create(
    @Body() corsOrigin: ClientAllowedCorsOriginDTO,
  ): Promise<ClientAllowedCorsOrigin> {
    return await this.clientsService.addAllowedCorsOrigin(corsOrigin)
  }

  /** Removes an cors origin from client */
  @Delete(':clientId/:origin')
  @ApiCreatedResponse()
  async delete(
    @Param('clientId') clientId: string,
    @Param('origin') origin: string,
  ): Promise<number> {
    if (!clientId || !origin) {
      throw new BadRequestException('clientId and origin must be provided')
    }

    return await this.clientsService.removeAllowedCorsOrigin(clientId, origin)
  }
}

import {
  ClientsService,
  ClientRedirectUriDTO,
  ClientRedirectUri,
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

// @ApiOAuth2(['@identityserver.api/read'])
@UseGuards(IdsAuthGuard, NationalIdGuard)
@ApiTags('redirect-uri')
@Controller('redirect-uri')
export class RedirectUriController {
  constructor(private readonly clientsService: ClientsService) {}

  /** Adds new redirect uri to client */
  @Post()
  @ApiCreatedResponse({ type: ClientRedirectUri })
  async create(
    @Body() redirectUri: ClientRedirectUriDTO,
  ): Promise<ClientRedirectUri> {
    return await this.clientsService.addRedirectUri(redirectUri)
  }

  /** Removes an redirect uri for client */
  @Delete(':clientId/:redirectUri')
  @ApiCreatedResponse()
  async delete(
    @Param('clientId') clientId: string,
    @Param('redirectUri') redirectUri: string,
  ): Promise<number> {
    if (!clientId || !redirectUri) {
      throw new BadRequestException('clientId and redirectUri must be provided')
    }

    return await this.clientsService.removeRedirectUri(clientId, redirectUri)
  }
}

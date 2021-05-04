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
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { IdsUserGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import { Scope } from '../access/scope.constants'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('redirect-uri')
@Controller('backend/redirect-uri')
export class RedirectUriController {
  constructor(private readonly clientsService: ClientsService) {}

  /** Adds new redirect uri to client */
  @Scopes(Scope.root, Scope.full)
  @Post()
  @ApiCreatedResponse({ type: ClientRedirectUri })
  async create(
    @Body() redirectUri: ClientRedirectUriDTO,
  ): Promise<ClientRedirectUri> {
    return await this.clientsService.addRedirectUri(redirectUri)
  }

  /** Removes an redirect uri for client */
  @Scopes(Scope.root, Scope.full)
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

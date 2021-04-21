import {
  ClientsService,
  ClientPostLogoutRedirectUriDTO,
  ClientPostLogoutRedirectUri,
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
import { IdsAuthGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import { Scope } from '../access/scope.constants'

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('client-post-logout-redirect-uri')
@Controller('backend/client-post-logout-redirect-uri')
export class ClientPostLogoutRedirectUriController {
  constructor(private readonly clientsService: ClientsService) {}

  /** Adds new Grant type to client */
  @Scopes(Scope.root, Scope.full)
  @Post()
  @ApiCreatedResponse({ type: ClientPostLogoutRedirectUri })
  async create(
    @Body() postLogoutUri: ClientPostLogoutRedirectUriDTO,
  ): Promise<ClientPostLogoutRedirectUri> {
    return await this.clientsService.addPostLogoutRedirectUri(postLogoutUri)
  }

  /** Removes a grant type from client */
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

    return await this.clientsService.removePostLogoutRedirectUri(
      clientId,
      redirectUri,
    )
  }
}

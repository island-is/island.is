import {
  ClientsService,
  ClientGrantTypeDTO,
  ClientGrantType,
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
@ApiTags('client-grant-type')
@Controller('backend/client-grant-type')
export class ClientGrantTypeController {
  constructor(private readonly clientsService: ClientsService) {}

  /** Adds new Grant type to client */
  @Scopes(Scope.root, Scope.full)
  @Post()
  @ApiCreatedResponse({ type: ClientGrantType })
  async create(
    @Body() grantType: ClientGrantTypeDTO,
  ): Promise<ClientGrantType> {
    return await this.clientsService.addGrantType(grantType)
  }

  /** Removes a grant type from client */
  @Scopes(Scope.root, Scope.full)
  @Delete(':clientId/:grantType')
  @ApiCreatedResponse()
  async delete(
    @Param('clientId') clientId: string,
    @Param('grantType') grantType: string,
  ): Promise<number> {
    if (!clientId || !grantType) {
      throw new BadRequestException('clientId and grantType must be provided')
    }

    return await this.clientsService.removeGrantType(clientId, grantType)
  }
}

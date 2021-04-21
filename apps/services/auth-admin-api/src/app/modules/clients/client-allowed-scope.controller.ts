import {
  ClientsService,
  ClientAllowedScopeDTO,
  ClientAllowedScope,
  ApiScope,
} from '@island.is/auth-api-lib'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { IdsAuthGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import { Scope } from '../access/scope.constants'

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('client-allowed-scope')
@Controller('backend/client-allowed-scope')
export class ClientAllowedScopeController {
  constructor(private readonly clientsService: ClientsService) {}

  /** Gets all scopes for client to select from */
  @Scopes(Scope.root, Scope.full)
  @Get()
  async findAvailabeScopes(): Promise<ApiScope[]> {
    return await this.clientsService.FindAvailabeScopes()
  }

  /** Adds new scope to client */
  @Scopes(Scope.root, Scope.full)
  @Post()
  @ApiCreatedResponse({ type: ClientAllowedScope })
  async create(
    @Body() scope: ClientAllowedScopeDTO,
  ): Promise<ClientAllowedScope> {
    return await this.clientsService.addAllowedScope(scope)
  }

  /** Removes a scope from client */
  @Scopes(Scope.root, Scope.full)
  @Delete(':clientId/:scopeName')
  @ApiCreatedResponse()
  async delete(
    @Param('clientId') clientId: string,
    @Param('scopeName') scopeName: string,
  ): Promise<number> {
    if (!clientId || !scopeName) {
      throw new BadRequestException('clientId and scopeName must be provided')
    }

    return await this.clientsService.removeAllowedScope(clientId, scopeName)
  }
}

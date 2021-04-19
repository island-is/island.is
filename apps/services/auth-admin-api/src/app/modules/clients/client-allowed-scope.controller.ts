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
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { NationalIdGuard } from '../access/national-id-guard'

@UseGuards(IdsUserGuard, NationalIdGuard)
@ApiTags('client-allowed-scope')
@Controller('backend/client-allowed-scope')
export class ClientAllowedScopeController {
  constructor(private readonly clientsService: ClientsService) {}

  /** Gets all scopes for client to select from */
  @Get()
  async findAvailabeScopes(): Promise<ApiScope[]> {
    return await this.clientsService.FindAvailabeScopes()
  }

  /** Adds new scope to client */
  @Post()
  @ApiCreatedResponse({ type: ClientAllowedScope })
  async create(
    @Body() scope: ClientAllowedScopeDTO,
  ): Promise<ClientAllowedScope> {
    return await this.clientsService.addAllowedScope(scope)
  }

  /** Removes a scope from client */
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

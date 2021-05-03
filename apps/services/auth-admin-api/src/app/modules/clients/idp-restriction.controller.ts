import {
  ClientsService,
  ClientIdpRestrictions,
  ClientIdpRestrictionDTO,
  IdpProvider,
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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { IdsUserGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import { Scope } from '../access/scope.constants'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('idp-restriction')
@Controller('backend/idp-restriction')
export class IdpRestrictionController {
  constructor(private readonly clientsService: ClientsService) {}

  /** Adds new IDP restriction */
  @Scopes(Scope.root, Scope.full)
  @Post()
  @ApiCreatedResponse({ type: ClientIdpRestrictions })
  async create(
    @Body() restriction: ClientIdpRestrictionDTO,
  ): Promise<ClientIdpRestrictions> {
    return await this.clientsService.addIdpRestriction(restriction)
  }

  /** Removes a idp restriction */
  @Scopes(Scope.root, Scope.full)
  @Delete(':clientId/:name')
  @ApiCreatedResponse()
  async delete(
    @Param('clientId') clientId: string,
    @Param('name') name: string,
  ): Promise<number> {
    if (!clientId || !name) {
      throw new BadRequestException('clientId and name must be provided')
    }

    return await this.clientsService.removeIdpRestriction(clientId, name)
  }

  /** Finds available idp providers that can be restricted */
  @Scopes(Scope.root, Scope.full)
  @Get()
  @ApiOkResponse({ type: [IdpProvider] })
  async findAllIdpRestrictions(): Promise<IdpProvider[] | null> {
    return await this.clientsService.findAllIdpRestrictions()
  }
}

import {
  DelegationScopeService,
  DelegationScope,
  DelegationScopeDTO,
  DelegationScopeDeleteDTO,
} from '@island.is/auth-api-lib'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('delegation-scope')
@Controller('delegations-scope')
export class DelegationScopeController {
  constructor(
    private readonly delegationsScopeService: DelegationScopeService,
  ) {}

  @Scopes('@island.is/auth/delegations:read')
  @Get(':delegationId')
  @ApiOkResponse({ isArray: true })
  async findAll(
    @Param('delegationId') delegationId: string,
  ): Promise<DelegationScope[] | null> {
    return await this.delegationsScopeService.findAll(delegationId)
  }

  @Scopes('@island.is/auth/delegations:write')
  @Post()
  @ApiCreatedResponse({ type: DelegationScope })
  async create(
    @Body() delegationScope: DelegationScopeDTO,
  ): Promise<DelegationScope | null> {
    return await this.delegationsScopeService.create(delegationScope)
  }

  @Scopes('@island.is/auth/delegations:write')
  @Delete()
  @ApiCreatedResponse()
  async delete(
    @Body() delegationScope: DelegationScopeDeleteDTO,
  ): Promise<number> {
    return await this.delegationsScopeService.delete(
      delegationScope.delegationId,
      delegationScope.scopeName,
    )
  }
}

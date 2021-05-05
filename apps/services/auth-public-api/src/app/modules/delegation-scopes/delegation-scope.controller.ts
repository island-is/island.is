import {
  DelegationScopeService,
  DelegationScope,
  DelegationScopeDTO,
} from '@island.is/auth-api-lib'
import {
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { number } from 'yargs'

// @UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('delegation-scope')
@Controller('delegations-scope')
export class DelegationScopeController {
  constructor(
    private readonly delegationsScopeService: DelegationScopeService,
  ) {}

  @Get(':delegationId')
  @ApiOkResponse({ isArray: true })
  async findAll(
    @Param('delegationId') delegationId: string,
  ): Promise<DelegationScope[] | null> {
    return await this.delegationsScopeService.findAll(delegationId)
  }

  @Post()
  @ApiCreatedResponse({ type: DelegationScope })
  async create(
    @Body() delegationScope: DelegationScopeDTO,
  ): Promise<DelegationScope | null> {
    return await this.delegationsScopeService.create(delegationScope)
  }

  @Delete(':delegationId/:scopeName')
  @ApiCreatedResponse({ type: number })
  async delete(
    @Param('delegationId') delegationId: string,
    @Param('scopeName') scopeName: string | null = null,
  ): Promise<number> {
    return await this.delegationsScopeService.delete(delegationId, scopeName)
  }
}

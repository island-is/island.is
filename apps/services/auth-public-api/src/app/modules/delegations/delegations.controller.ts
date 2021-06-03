import {
  DelegationsService,
  DelegationDTO,
  UpdateDelegationDTO,
  CreateDelegationDTO,
} from '@island.is/auth-api-lib'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  CurrentActor,
  CurrentUser,
  ActorScopes,
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
  NotFoundException,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AuthScope } from '@island.is/auth/scopes'

import { environment } from '../../../environments'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('delegations')
@Controller('public/delegations')
export class DelegationsController {
  constructor(private readonly delegationsService: DelegationsService) {}

  @ActorScopes(AuthScope.actorDelegations)
  @Get()
  @ApiOkResponse({ type: [DelegationDTO] })
  async findAllTo(@CurrentActor() user: User): Promise<DelegationDTO[]> {
    const wards = await this.delegationsService.findAllWardsTo(
      user,
      environment.nationalRegistry.xroad.clientId ?? '',
    )

    const companies = await this.delegationsService.findAllCompaniesTo(
      user.nationalId,
    )

    const custom = await this.delegationsService.findAllValidCustomTo(
      user.nationalId,
    )

    return [...wards, ...companies, ...custom]
  }

  @Scopes(AuthScope.writeDelegations)
  @Post()
  @ApiCreatedResponse({ type: DelegationDTO })
  create(
    @CurrentUser() user: User,
    @Body() delegation: CreateDelegationDTO,
  ): Promise<DelegationDTO | null> {
    return this.delegationsService.create(user.nationalId, delegation)
  }

  @Scopes(AuthScope.writeDelegations)
  @Put(':id')
  @ApiCreatedResponse({ type: DelegationDTO })
  update(
    @CurrentUser() user: User,
    @Body() delegation: UpdateDelegationDTO,
    @Param('id') id: string,
  ): Promise<DelegationDTO | null> {
    return this.delegationsService.update(user.nationalId, delegation, id)
  }

  @Scopes(AuthScope.writeDelegations)
  @Delete('public/delegations/custom/delete/from/:id')
  @ApiCreatedResponse()
  async deleteFrom(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<number> {
    return await this.delegationsService.deleteFrom(user.nationalId, id)
  }

  @Scopes(AuthScope.writeDelegations)
  @Delete('public/delegations/custom/delete/to/:id')
  @ApiCreatedResponse()
  async deleteTo(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<number> {
    return await this.delegationsService.deleteTo(user.nationalId, id)
  }

  @Scopes(AuthScope.readDelegations)
  @Get('public/delegations/custom/findone/:id')
  @ApiOkResponse({ type: DelegationDTO })
  async findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<DelegationDTO | null> {
    return await this.delegationsService.findOne(user.nationalId, id)
  }

  @Scopes(AuthScope.readDelegations)
  @Get('custom/findone/to/:nationalId')
  @ApiOkResponse({ type: DelegationDTO })
  async findOneTo(
    @CurrentUser() user: User,
    @Param('nationalId') nationalId: string,
  ): Promise<DelegationDTO | null> {
    const delegation = await this.delegationsService.findOneTo(
      user.nationalId,
      nationalId,
    )
    if (!delegation) {
      throw new NotFoundException(
        `Delegation<from: ${user.nationalId};to: ${nationalId}> was not found`,
      )
    }

    return delegation
  }

  @Scopes(AuthScope.readDelegations)
  @Get('custom/to')
  @ApiOkResponse({ type: [DelegationDTO] })
  async findAllCustomTo(
    @CurrentUser() user: User,
  ): Promise<DelegationDTO[] | null> {
    return await this.delegationsService.findAllCustomTo(user.nationalId)
  }

  @Scopes(AuthScope.readDelegations)
  @Get('public/delegations/custom/from')
  @ApiOkResponse({ type: [DelegationDTO] })
  async findAllCustomFrom(
    @CurrentUser() user: User,
  ): Promise<DelegationDTO[] | null> {
    return await this.delegationsService.findAllCustomFrom(user.nationalId)
  }
}

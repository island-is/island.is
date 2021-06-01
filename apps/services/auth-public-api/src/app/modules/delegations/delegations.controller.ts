import {
  DelegationsService,
  IDelegation,
  DelegationDTO,
  Delegation,
} from '@island.is/auth-api-lib'
import {
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
  CurrentActor,
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
import { environment } from '../../../environments'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('delegations')
@Controller('delegations')
export class DelegationsController {
  constructor(private readonly delegationsService: DelegationsService) {}

  @Scopes('@island.is/auth/delegations:read')
  @Get()
  @ApiOkResponse({ isArray: true })
  async findAllTo(@CurrentActor() user: User): Promise<IDelegation[]> {
    const wards = await this.delegationsService.findAllWardsTo(
      user,
      environment.nationalRegistry.xroad.clientId,
    )

    const companies = await this.delegationsService.findAllCompaniesTo(
      user.nationalId,
    )

    const custom = await this.delegationsService.findAllValidCustomTo(
      user.nationalId,
    )

    return [...wards, ...companies, ...custom]
  }

  @Scopes('@island.is/auth-public/delegations:write')
  @Post()
  @ApiCreatedResponse({ type: Delegation })
  async create(
    @CurrentUser() user: User,
    @Body() delegation: DelegationDTO,
  ): Promise<Delegation | null> {
    return await this.delegationsService.create(user.nationalId, delegation)
  }

  @Scopes('@island.is/auth-public/delegations:write')
  @Put(':id')
  @ApiCreatedResponse({ type: Delegation })
  async update(
    @CurrentUser() user: User,
    @Body() delegation: DelegationDTO,
    @Param('id') id: string,
  ): Promise<Delegation | null> {
    return await this.delegationsService.update(user.nationalId, delegation, id)
  }

  @Scopes('@island.is/auth-public/delegations:write')
  @Delete('custom/delete/from/:id')
  @ApiCreatedResponse()
  async deleteFrom(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<number> {
    return await this.delegationsService.deleteFrom(user.nationalId, id)
  }

  @Scopes('@island.is/auth-public/delegations:write')
  @Delete('custom/delete/to/:id')
  @ApiCreatedResponse()
  async deleteTo(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<number> {
    return await this.delegationsService.deleteTo(user.nationalId, id)
  }

  @Scopes('@island.is/auth-public/delegations:read')
  @Get('custom/findone/:id')
  @ApiOkResponse({ type: Delegation })
  async findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<Delegation | null> {
    return await this.delegationsService.findOne(user.nationalId, id)
  }

  @Scopes('@island.is/auth-public/delegations:read')
  @Get('custom/to')
  @ApiOkResponse({ type: [Delegation] })
  async findAllCustomTo(
    @CurrentUser() user: User,
  ): Promise<Delegation[] | null> {
    return await this.delegationsService.findAllCustomTo(user.nationalId)
  }

  @Scopes('@island.is/auth-public/delegations:read')
  @Get('custom/from')
  @ApiOkResponse({ type: [Delegation] })
  async findAllCustomFrom(
    @CurrentUser() user: User,
  ): Promise<Delegation[] | null> {
    return await this.delegationsService.findAllCustomFrom(user.nationalId)
  }
}

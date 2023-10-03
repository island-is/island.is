import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'

import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { MunicipalityService } from './municipality.service'
import { MunicipalityModel } from './models'

import { apiBasePath, StaffRole } from '@island.is/financial-aid/shared/lib'
import type { Staff } from '@island.is/financial-aid/shared/lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { StaffGuard } from '../../guards/staff.guard'
import { StaffRolesRules } from '../../decorators/staffRole.decorator'
import {
  MunicipalityActivityDto,
  UpdateMunicipalityDto,
  CreateMunicipalityDto,
} from './dto'
import { CreateStaffDto } from '../staff/dto'
import { MunicipalitiesFinancialAidScope } from '@island.is/auth/scopes'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@UseGuards(IdsUserGuard, ScopesGuard)
@Controller(`${apiBasePath}/municipality`)
@ApiTags('municipality')
export class MunicipalityController {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly municipalityService: MunicipalityService,
  ) {}

  @UseGuards(ScopesGuard)
  @Scopes(MunicipalitiesFinancialAidScope.read)
  @Get('id/:id')
  @ApiOkResponse({
    type: MunicipalityModel,
    description: 'Gets municipality by id',
  })
  async getById(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<MunicipalityModel> {
    this.logger.debug('Municipality controller: Getting municipality by id')

    let municipality
    try {
      municipality = user.scope.includes(
        MunicipalitiesFinancialAidScope.employee,
      )
        ? await this.municipalityService.findByMunicipalityIdWithNav(id)
        : await this.municipalityService.findByMunicipalityId(id)
    } catch (e) {
      this.logger.error(
        'Municipality controller: Failed getting municipality by id',
        e,
      )
      throw e
    }

    if (!municipality) {
      throw new NotFoundException(404, `municipality ${id} not found`)
    }
    return municipality
  }

  @UseGuards(ScopesGuard)
  @Scopes(MunicipalitiesFinancialAidScope.read)
  @Get('ids')
  @ApiOkResponse({
    type: [MunicipalityModel],
    description: 'Gets municipalities by ids',
  })
  async getByMunicipalityIds(
    @CurrentUser() staff: Staff,
  ): Promise<MunicipalityModel[]> {
    return this.municipalityService.findByMunicipalityIds(staff.nationalId)
  }

  @UseGuards(StaffGuard)
  @StaffRolesRules(StaffRole.SUPERADMIN)
  @Scopes(MunicipalitiesFinancialAidScope.employee)
  @Post('')
  @ApiCreatedResponse({
    type: MunicipalityModel,
    description: 'Creates a new municipality',
  })
  create(
    @Body()
    input: {
      municipalityInput: CreateMunicipalityDto
      adminInput?: CreateStaffDto
    },
  ): Promise<MunicipalityModel> {
    return this.municipalityService.create(
      input.municipalityInput,
      input.adminInput,
    )
  }

  @UseGuards(StaffGuard)
  @StaffRolesRules(StaffRole.SUPERADMIN)
  @Scopes(MunicipalitiesFinancialAidScope.employee)
  @Get('')
  @ApiOkResponse({
    type: [MunicipalityModel],
    description: 'Gets municipalities',
  })
  async getAllMunicipalities(): Promise<MunicipalityModel[]> {
    return await this.municipalityService.getAll()
  }

  @Put('')
  @UseGuards(StaffGuard)
  @StaffRolesRules(StaffRole.ADMIN)
  @Scopes(MunicipalitiesFinancialAidScope.employee)
  @ApiOkResponse({
    type: MunicipalityModel,
    description: 'Updates municipality',
  })
  async updateMunicipality(
    @CurrentUser() staff: Staff,
    @Body() input: UpdateMunicipalityDto,
  ): Promise<MunicipalityModel[]> {
    return await this.municipalityService.updateMunicipality(input, staff)
  }

  @Put('activity/:id')
  @UseGuards(StaffGuard)
  @StaffRolesRules(StaffRole.SUPERADMIN)
  @Scopes(MunicipalitiesFinancialAidScope.employee)
  @ApiOkResponse({
    type: MunicipalityModel,
    description: 'Updates activity for municipality',
  })
  async updateMunicipalityActivity(
    @Param('id') id: string,
    @Body() municipalityToUpdate: MunicipalityActivityDto,
  ): Promise<MunicipalityModel> {
    const { numberOfAffectedRows, updatedMunicipality } =
      await this.municipalityService.update(id, municipalityToUpdate)

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Municipality ${id} does not exist`)
    }

    return updatedMunicipality
  }
}

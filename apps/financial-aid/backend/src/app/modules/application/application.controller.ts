import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Put,
  NotFoundException,
  Inject,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger'
import { ApplicationService } from './application.service'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  CurrentApplicationModel,
  ApplicationModel,
  UpdateApplicationTableResponse,
} from './models'

import {
  ApplicationEventModel,
  ApplicationEventService,
} from '../applicationEvent'

import {
  CreateApplicationDto,
  UpdateApplicationDto,
  CreateApplicationEventDto,
} from './dto'

import {
  apiBasePath,
  ApplicationStateUrl,
} from '@island.is/financial-aid/shared/lib'

import type { User, Staff } from '@island.is/financial-aid/shared/lib'

import {
  ApplicationFilters,
  RolesRule,
} from '@island.is/financial-aid/shared/lib'
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { RolesGuard } from '../../guards/roles.guard'
import { CurrentStaff, CurrentUser, RolesRules } from '../../decorators'
import { ApplicationGuard } from '../../guards/application.guard'
import { StaffService } from '../staff'
import { IsSpouseResponse } from './models/isSpouse.response'
import { EmployeeGuard } from '../../guards/employee.guard'

@UseGuards(IdsUserGuard)
@Controller(`${apiBasePath}/application`)
@ApiTags('application')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly applicationEventService: ApplicationEventService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly staffService: StaffService,
  ) {}

  @UseGuards(RolesGuard)
  @RolesRules(RolesRule.OSK)
  @Get('nationalId/:nationalId')
  @ApiOkResponse({
    type: CurrentApplicationModel,
    description: 'Checks if user has a current application for this period',
  })
  async getCurrentApplication(
    @Param('nationalId') nationalId: string,
  ): Promise<CurrentApplicationModel> {
    this.logger.debug('Application controller: Getting current application')
    const currentApplication = await this.applicationService.getCurrentApplication(
      nationalId,
    )

    if (currentApplication === null) {
      throw new NotFoundException(404, 'Current application not found')
    }

    return currentApplication
  }

  @UseGuards(RolesGuard)
  @RolesRules(RolesRule.OSK)
  @Get('spouse/:spouseNationalId')
  @ApiOkResponse({
    type: IsSpouseResponse,
    description: 'Checking if user is spouse',
  })
  async isSpouse(
    @Param('spouseNationalId') spouseNationalId: string,
  ): Promise<IsSpouseResponse> {
    this.logger.debug('Application controller: Checking if user is spouse')

    return {
      HasApplied: await this.applicationService.hasSpouseApplied(
        spouseNationalId,
      ),
    }
  }

  @UseGuards(RolesGuard, EmployeeGuard)
  @RolesRules(RolesRule.VEITA)
  @Get('state/:stateUrl')
  @ApiOkResponse({
    type: ApplicationModel,
    isArray: true,
    description: 'Gets all existing applications',
  })
  async getAll(
    @Param('stateUrl') stateUrl: ApplicationStateUrl,
    @CurrentStaff() staff: Staff,
  ): Promise<ApplicationModel[]> {
    this.logger.debug('Application controller: Getting all applications')
    return this.applicationService.getAll(stateUrl, staff.id)
  }

  @UseGuards(ApplicationGuard)
  @Get('id/:id')
  @ApiOkResponse({
    type: ApplicationModel,
    description: 'Get application',
  })
  async getById(@Param('id') id: string, @CurrentUser() user: User) {
    this.logger.debug(`Application controller: Getting application by id ${id}`)
    const application = await this.applicationService.findById(id, user.service)

    if (!application) {
      throw new NotFoundException(`application ${id} not found`)
    }

    return application
  }

  @UseGuards(RolesGuard, EmployeeGuard)
  @RolesRules(RolesRule.VEITA)
  @Get('filters')
  @ApiOkResponse({
    description: 'Gets all existing applications filters',
  })
  async getAllFilters(
    @CurrentStaff() staff: Staff,
  ): Promise<ApplicationFilters> {
    this.logger.debug('Application controller: Getting application filters')
    return this.applicationService.getAllFilters(staff.id)
  }

  @Put('id/:id')
  @ApiOkResponse({
    type: ApplicationModel,
    description: 'Updates an existing application',
  })
  async update(
    @Param('id') id: string,
    @Body() applicationToUpdate: UpdateApplicationDto,
    @CurrentUser() user: User,
  ): Promise<ApplicationModel> {
    this.logger.debug(
      `Application controller: Updating application with id ${id}`,
    )
    const {
      numberOfAffectedRows,
      updatedApplication,
    } = await this.applicationService.update(id, applicationToUpdate, user)

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Application ${id} does not exist`)
    }

    if (user.service === RolesRule.VEITA) {
      const staff = await this.staffService.findById(updatedApplication.staffId)
      updatedApplication?.setDataValue('staff', staff)
    }

    return updatedApplication
  }

  @UseGuards(RolesGuard, EmployeeGuard)
  @RolesRules(RolesRule.VEITA)
  @Put(':id/:stateUrl')
  @ApiOkResponse({
    type: UpdateApplicationTableResponse,
    description:
      'Updates an existing application and returns application table',
  })
  async updateTable(
    @CurrentStaff() staff: Staff,
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('stateUrl') stateUrl: ApplicationStateUrl,
    @Body() applicationToUpdate: UpdateApplicationDto,
  ): Promise<UpdateApplicationTableResponse> {
    await this.applicationService.update(
      id,
      applicationToUpdate,
      user.service,
      staff,
    )
    return {
      applications: await this.applicationService.getAll(stateUrl, staff.id),
      filters: await this.applicationService.getAllFilters(staff.id),
    }
  }

  @UseGuards(RolesGuard)
  @RolesRules(RolesRule.OSK)
  @Post('')
  @ApiCreatedResponse({
    type: ApplicationModel,
    description: 'Creates a new application',
  })
  create(
    @CurrentUser() user: User,
    @Body() application: CreateApplicationDto,
  ): Promise<ApplicationModel> {
    this.logger.debug('Application controller: Creating application')
    return this.applicationService.create(application, user)
  }

  @Post('event')
  @ApiCreatedResponse({
    type: ApplicationEventModel,
    description: 'Creates a new application event',
  })
  async createEvent(
    @Body() applicationEvent: CreateApplicationEventDto,
    @CurrentUser() user: User,
  ): Promise<ApplicationModel> {
    await this.applicationEventService.create(applicationEvent)

    const application = await this.applicationService.findById(
      applicationEvent.applicationId,
      user.service,
    )

    if (!application) {
      throw new NotFoundException(
        `application ${applicationEvent.applicationId} not found`,
      )
    }

    return application
  }
}

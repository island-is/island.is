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
  ApplicationModel,
  SpouseResponse,
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
  StaffRole,
} from '@island.is/financial-aid/shared/lib'

import type {
  User,
  Staff,
  Application,
} from '@island.is/financial-aid/shared/lib'

import {
  ApplicationFilters,
  RolesRule,
} from '@island.is/financial-aid/shared/lib'
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { RolesGuard } from '../../guards/roles.guard'
import { CurrentStaff, CurrentUser, RolesRules } from '../../decorators'
import { ApplicationGuard } from '../../guards/application.guard'
import { StaffService } from '../staff'
import { StaffGuard } from '../../guards/staff.guard'
import { CurrentApplication } from '../../decorators/application.decorator'
import { StaffRolesRules } from '../../decorators/staffRole.decorator'

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
    description: 'Checks if user has a current application for this period',
  })
  async getCurrentApplication(
    @Param('nationalId') nationalId: string,
  ): Promise<string> {
    this.logger.debug('Application controller: Getting current application')
    const currentApplication = await this.applicationService.getCurrentApplicationId(
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
    type: SpouseResponse,
    description: 'Checking if user is spouse',
  })
  async spouse(
    @Param('spouseNationalId') spouseNationalId: string,
  ): Promise<SpouseResponse> {
    this.logger.debug('Application controller: Checking if user is spouse')

    return await this.applicationService.getSpouseInfo(spouseNationalId)
  }

  @UseGuards(RolesGuard, StaffGuard)
  @RolesRules(RolesRule.VEITA)
  @StaffRolesRules(StaffRole.EMPLOYEE)
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
    return this.applicationService.getAll(
      stateUrl,
      staff.id,
      staff.municipalityId,
    )
  }

  @UseGuards(ApplicationGuard)
  @Get('id/:id')
  @ApiOkResponse({
    type: ApplicationModel,
    description: 'Get application',
  })
  async getById(
    @Param('id') id: string,
    @CurrentApplication() application: Application,
  ) {
    this.logger.debug(`Application controller: Getting application by id ${id}`)
    return application
  }

  @UseGuards(RolesGuard, StaffGuard)
  @RolesRules(RolesRule.VEITA)
  @StaffRolesRules(StaffRole.EMPLOYEE)
  @Get('filters')
  @ApiOkResponse({
    description: 'Gets all existing applications filters',
  })
  async getAllFilters(
    @CurrentStaff() staff: Staff,
  ): Promise<ApplicationFilters> {
    this.logger.debug('Application controller: Getting application filters')
    return this.applicationService.getAllFilters(staff.id, staff.municipalityId)
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

    let staff = undefined

    if (user.service === RolesRule.VEITA) {
      staff = await this.staffService.findByNationalId(user.nationalId)
    }

    const {
      numberOfAffectedRows,
      updatedApplication,
    } = await this.applicationService.update(id, applicationToUpdate, staff)

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Application ${id} does not exist`)
    }

    updatedApplication?.setDataValue('staff', staff)

    return updatedApplication
  }

  @UseGuards(RolesGuard, StaffGuard)
  @RolesRules(RolesRule.VEITA)
  @StaffRolesRules(StaffRole.EMPLOYEE)
  @Put(':id/:stateUrl')
  @ApiOkResponse({
    type: UpdateApplicationTableResponse,
    description:
      'Updates an existing application and returns application table',
  })
  async updateTable(
    @CurrentStaff() staff: Staff,
    @Param('id') id: string,
    @Param('stateUrl') stateUrl: ApplicationStateUrl,
    @Body() applicationToUpdate: UpdateApplicationDto,
  ): Promise<UpdateApplicationTableResponse> {
    await this.applicationService.update(id, applicationToUpdate, staff)
    return {
      applications: await this.applicationService.getAll(
        stateUrl,
        staff.id,
        staff.municipalityId,
      ),
      filters: await this.applicationService.getAllFilters(
        staff.id,
        staff.municipalityId,
      ),
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

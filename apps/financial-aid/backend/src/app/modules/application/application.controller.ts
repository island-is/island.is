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
  UpdateApplicationResponse,
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

import type { User } from '@island.is/financial-aid/shared/lib'

import {
  ApplicationFilters,
  RolesRule,
} from '@island.is/financial-aid/shared/lib'
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { RolesGuard } from '../../guards'
import { CurrentUser, RolesRules } from '../../decorators'
import { ApplicationGuard } from '../../guards/application.guard'
import { StaffService } from '../staff'

@UseGuards(IdsUserGuard)
@Controller(apiBasePath)
@ApiTags('applications')
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
  @Get('currentApplication')
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
  @RolesRules(RolesRule.VEITA)
  @Get('allApplications/:stateUrl')
  @ApiOkResponse({
    type: ApplicationModel,
    isArray: true,
    description: 'Gets all existing applications',
  })
  getAll(
    @Param('stateUrl') stateUrl: ApplicationStateUrl,
  ): Promise<ApplicationModel[]> {
    this.logger.debug('Application controller: Getting all applications')
    return this.applicationService.getAll(stateUrl)
  }

  @UseGuards(ApplicationGuard)
  @Get('applications/:id')
  @ApiOkResponse({
    type: ApplicationModel,
    description: 'Get application',
  })
  async getById(@Param('id') id: string) {
    this.logger.debug(`Application controller: Getting application by id ${id}`)
    const application = await this.applicationService.findById(id)

    if (!application) {
      throw new NotFoundException(`application ${id} not found`)
    }

    return application
  }

  @UseGuards(RolesGuard)
  @RolesRules(RolesRule.VEITA)
  @Get('applicationFilters')
  @ApiOkResponse({
    description: 'Gets all existing applications filters',
  })
  getAllFilters(): Promise<ApplicationFilters> {
    this.logger.debug('Application controller: Getting application filters')
    return this.applicationService.getAllFilters()
  }

  @Put('applications/:id')
  @ApiOkResponse({
    type: ApplicationModel,
    description: 'Updates an existing application',
  })
  async update(
    @Param('id') id: string,
    @Body() applicationToUpdate: UpdateApplicationDto,
  ): Promise<ApplicationModel> {
    this.logger.debug(
      `Application controller: Updating application with id ${id}`,
    )
    const {
      numberOfAffectedRows,
      updatedApplication,
    } = await this.applicationService.update(id, applicationToUpdate)

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Application ${id} does not exist`)
    }

    return updatedApplication
  }

  @Put('applications/:id/:stateUrl')
  @ApiOkResponse({
    type: UpdateApplicationTableResponse,
    description:
      'Updates an existing application and returns application table',
  })
  async updateTable(
    @Param('id') id: string,
    @Param('stateUrl') stateUrl: ApplicationStateUrl,
    @Body() applicationToUpdate: UpdateApplicationDto,
  ): Promise<UpdateApplicationTableResponse> {
    await this.applicationService.update(id, applicationToUpdate)
    return {
      applications: await this.applicationService.getAll(stateUrl),
      filters: await this.applicationService.getAllFilters(),
    }
  }

  @Put('updateApplication/:id')
  @ApiOkResponse({
    type: UpdateApplicationResponse,
    description: 'Updates an existing application',
  })
  async updateApplication(
    @Param('id') id: string,
    @Body() applicationToUpdate: UpdateApplicationDto,
  ): Promise<UpdateApplicationResponse> {
    const {
      numberOfAffectedRows,
      updatedApplication,
    } = await this.applicationService.update(id, applicationToUpdate)

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Application ${id} does not exist`)
    }

    const staff = await this.staffService.findById(updatedApplication.staffId)
    updatedApplication?.setDataValue('staff', staff)

    return {
      application: updatedApplication,
      filters: await this.applicationService.getAllFilters(),
    }
  }

  @Post('application')
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

  @Post('applicationEvent')
  @ApiCreatedResponse({
    type: ApplicationEventModel,
    description: 'Creates a new application event',
  })
  async createEvent(
    @Body() applicationEvent: CreateApplicationEventDto,
  ): Promise<ApplicationModel> {
    await this.applicationEventService.create(applicationEvent)

    const application = await this.applicationService.findById(
      applicationEvent.applicationId,
    )

    if (!application) {
      throw new NotFoundException(
        `application ${applicationEvent.applicationId} not found`,
      )
    }

    return application
  }
}

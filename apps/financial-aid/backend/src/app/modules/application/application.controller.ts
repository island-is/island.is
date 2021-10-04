import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Put,
  NotFoundException,
  Query,
} from '@nestjs/common'

import { ApiOkResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger'

import { ApplicationService } from './application.service'
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
  CurrentHttpUser,
  JwtAuthGuard,
  TokenGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/financial-aid/auth'

import { ApplicationGuard } from '../../guards/application.guard'

import type {
  Application,
  ApplicationStateUrl,
  User,
} from '@island.is/financial-aid/shared/lib'

import {
  ApplicationFilters,
  RolesRule,
} from '@island.is/financial-aid/shared/lib'

@Controller('api')
@ApiTags('applications')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly applicationEventService: ApplicationEventService,
  ) {}

  @UseGuards(TokenGuard)
  @Get('getCurrentApplication')
  @ApiOkResponse({
    type: CurrentApplicationModel,
    description: 'Checks if user has a current application for this period',
  })
  async getCurrentApplication(@Query('nationalId') nationalId: string) {
    return await this.applicationService.getCurrentApplication(nationalId)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
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
    return this.applicationService.getAll(stateUrl)
  }

  @UseGuards(JwtAuthGuard, ApplicationGuard)
  @Get('applications/:id')
  @ApiOkResponse({
    type: ApplicationModel,
    description: 'Get application',
  })
  async getById(@Param('id') id: string) {
    const application = await this.applicationService.findById(id)

    if (!application) {
      throw new NotFoundException(`application ${id} not found`)
    }

    return application
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(RolesRule.VEITA)
  @Get('applicationFilters')
  @ApiOkResponse({
    description: 'Gets all existing applications filters',
  })
  getAllFilters(): Promise<ApplicationFilters> {
    return this.applicationService.getAllFilters()
  }

  @UseGuards(JwtAuthGuard)
  @Put('applications/:id')
  @ApiOkResponse({
    type: ApplicationModel,
    description: 'Updates an existing application',
  })
  async update(
    @Param('id') id: string,
    @Body() applicationToUpdate: UpdateApplicationDto,
  ): Promise<ApplicationModel> {
    const {
      numberOfAffectedRows,
      updatedApplication,
    } = await this.applicationService.update(id, applicationToUpdate)

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Application ${id} does not exist`)
    }

    return updatedApplication
  }

  @UseGuards(JwtAuthGuard)
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

    return {
      application: updatedApplication,
      filters: await this.applicationService.getAllFilters(),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('application')
  @ApiCreatedResponse({
    type: ApplicationModel,
    description: 'Creates a new application',
  })
  create(
    @CurrentHttpUser() user: User,
    @Body() application: CreateApplicationDto,
  ): Promise<ApplicationModel> {
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

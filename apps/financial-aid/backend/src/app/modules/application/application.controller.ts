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
  Inject,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger'
import { ApplicationService } from './application.service'
import { CurrentApplicationModel, ApplicationModel } from './models'
import { CreateApplicationDto, UpdateApplicationDto } from './dto'
import { apiBasePath, User } from '@island.is/financial-aid/shared/lib'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  ApplicationFilters,
  RolesRule,
} from '@island.is/financial-aid/shared/lib'
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { RolesGuard } from '../../guards'
import { CurrentUser, RolesRules } from '../../decorators'
import { ApplicationGuard } from '../../guards/application.guard'

@UseGuards(IdsUserGuard)
@Controller(apiBasePath)
@ApiTags('applications')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @UseGuards(RolesGuard)
  @RolesRules(RolesRule.OSK)
  @Get('currentApplication')
  @ApiOkResponse({
    type: CurrentApplicationModel,
    description: 'Checks if user has a current application for this period',
  })
  async getCurrentApplication(
    @Query('nationalId') nationalId: string,
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
  @Get('applications')
  @ApiOkResponse({
    type: ApplicationModel,
    isArray: true,
    description: 'Gets all existing applications',
  })
  getAll(): Promise<ApplicationModel[]> {
    this.logger.debug('Application controller: Getting all applications')
    return this.applicationService.getAll()
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
}

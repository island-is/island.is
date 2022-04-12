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
  ForbiddenException,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger'
import { ApplicationService } from './application.service'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  ApplicationModel,
  UpdateApplicationTableResponse,
  SpouseResponse,
  FilterApplicationsResponse,
} from './models'

import {
  ApplicationEventModel,
  ApplicationEventService,
} from '../applicationEvent'

import {
  CreateApplicationDto,
  UpdateApplicationDto,
  CreateApplicationEventDto,
  FilterApplicationsDto,
} from './dto'

import {
  apiBasePath,
  ApplicationEventType,
  ApplicationStateUrl,
  StaffRole,
} from '@island.is/financial-aid/shared/lib'

import type {
  User as FinancialAidUser,
  Staff,
  Application,
} from '@island.is/financial-aid/shared/lib'

import { Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'

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
import { AuditService } from '@island.is/nest/audit'
import { MunicipalitiesFinancialAidScope } from '@island.is/auth/scopes'

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
    private readonly auditService: AuditService,
  ) {}

  @UseGuards(RolesGuard)
  @RolesRules(RolesRule.OSK)
  @Get('nationalId')
  @ApiOkResponse({
    description: 'Checks if user has a current application for this period',
  })
  async getCurrentApplication(@CurrentUser() user: User): Promise<string> {
    this.logger.debug('Application controller: Getting current application')
    const currentApplication = await this.applicationService.getCurrentApplicationId(
      user.nationalId,
    )

    if (currentApplication === null) {
      throw new NotFoundException(404, 'Current application not found')
    }

    return currentApplication
  }

  @UseGuards(RolesGuard, StaffGuard)
  @RolesRules(RolesRule.VEITA)
  @StaffRolesRules(StaffRole.EMPLOYEE)
  @Get('find/:nationalId')
  @ApiOkResponse({
    type: ApplicationModel,
    isArray: true,
    description: 'Searches for application by nationalId',
  })
  async findApplication(
    @Param('nationalId') nationalId: string,
    @CurrentStaff() staff: Staff,
    @CurrentUser() user: User,
  ): Promise<ApplicationModel[]> {
    this.logger.debug('Search for application')

    const applications = await this.applicationService.findByNationalId(
      nationalId,
      staff.municipalityIds,
    )

    this.auditService.audit({
      auth: user,
      action: 'findByNationalId',
      resources: applications.map((application) => application.id),
    })

    return applications
  }

  @UseGuards(RolesGuard)
  @RolesRules(RolesRule.OSK)
  @Get('spouse')
  @ApiOkResponse({
    type: SpouseResponse,
    description: 'Checking if user is spouse',
  })
  async spouse(@CurrentUser() user: User): Promise<SpouseResponse> {
    this.logger.debug('Application controller: Checking if user is spouse')

    return await this.applicationService.getSpouseInfo(user.nationalId)
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
      staff.municipalityIds,
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
    @CurrentUser() user: User,
  ) {
    this.logger.debug(`Application controller: Getting application by id ${id}`)

    this.auditService.audit({
      auth: user,
      action: 'getApplication',
      resources: application.id,
    })

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
    return this.applicationService.getAllFilters(
      staff.id,
      staff.municipalityIds,
    )
  }

  @UseGuards(ApplicationGuard)
  @Put('id/:id')
  @ApiOkResponse({
    type: ApplicationModel,
    description: 'Updates an existing application',
  })
  async update(
    @Param('id') id: string,
    @Body() applicationToUpdate: UpdateApplicationDto,
    @CurrentUser() user: FinancialAidUser,
  ): Promise<ApplicationModel> {
    this.logger.debug(
      `Application controller: Updating application with id ${id}`,
    )

    let staff = undefined

    const staffUpdateEvents = [
      ApplicationEventType.REJECTED,
      ApplicationEventType.APPROVED,
      ApplicationEventType.STAFFCOMMENT,
      ApplicationEventType.INPROGRESS,
      ApplicationEventType.ASSIGNCASE,
      ApplicationEventType.NEW,
    ]

    const applicantUpdateEvents = [
      ApplicationEventType.USERCOMMENT,
      ApplicationEventType.SPOUSEFILEUPLOAD,
      ApplicationEventType.FILEUPLOAD,
    ]

    if (user.service === RolesRule.VEITA) {
      staff = await this.staffService.findByNationalId(user.nationalId)
      if (!staff) {
        throw new ForbiddenException('Staff not found')
      }
    }

    if (
      (user.service === RolesRule.OSK &&
        staffUpdateEvents.includes(applicationToUpdate.event)) ||
      (user.service === RolesRule.VEITA &&
        applicantUpdateEvents.includes(applicationToUpdate.event))
    ) {
      throw new ForbiddenException(
        'User not allowed to make this change to application',
      )
    }

    const updatedApplication = await this.applicationService.update(
      id,
      applicationToUpdate,
      staff,
    )

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
        staff.municipalityIds,
      ),
      filters: await this.applicationService.getAllFilters(
        staff.id,
        staff.municipalityIds,
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
    @CurrentUser() user: FinancialAidUser,
    @Body() application: CreateApplicationDto,
  ): Promise<ApplicationModel> {
    this.logger.debug('Application controller: Creating application')
    return this.applicationService.create(application, user)
  }

  @UseGuards(ScopesGuard, ApplicationGuard)
  @Scopes(MunicipalitiesFinancialAidScope.write)
  @Post('event')
  @ApiCreatedResponse({
    type: ApplicationEventModel,
    description: 'Creates a new application event',
  })
  async createEvent(
    @Body() applicationEvent: CreateApplicationEventDto,
    @CurrentUser() user: FinancialAidUser,
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

  @UseGuards(RolesGuard)
  @RolesRules(RolesRule.VEITA)
  @Post('filter')
  @ApiOkResponse({
    type: FilterApplicationsResponse,
    description: 'Filter applications',
  })
  filter(
    @Body() filters: FilterApplicationsDto,
  ): Promise<FilterApplicationsResponse> {
    this.logger.debug('Application controller: Filter applications')
    return this.applicationService.filter(filters)
  }
}

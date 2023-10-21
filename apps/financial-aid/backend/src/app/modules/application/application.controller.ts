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
  SpouseEmailResponse,
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
  SpouseEmailDto,
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

import type { User } from '@island.is/auth-nest-tools'

import { Scopes, ScopesGuard, CurrentUser } from '@island.is/auth-nest-tools'

import { ApplicationFilters } from '@island.is/financial-aid/shared/lib'
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { CurrentStaff } from '../../decorators/staff.decorator'
import { ApplicationGuard } from '../../guards/application.guard'
import { StaffService } from '../staff'
import { StaffGuard } from '../../guards/staff.guard'
import { CurrentApplication } from '../../decorators/application.decorator'
import { StaffRolesRules } from '../../decorators/staffRole.decorator'
import { AuditService } from '@island.is/nest/audit'
import { MunicipalitiesFinancialAidScope } from '@island.is/auth/scopes'

@UseGuards(IdsUserGuard, ScopesGuard)
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

  @Scopes(
    MunicipalitiesFinancialAidScope.read,
    MunicipalitiesFinancialAidScope.applicant,
  )
  @Get('nationalId')
  @ApiOkResponse({
    type: String,
    description: 'Checks if user has a current application for this period',
  })
  async getCurrentApplication(@CurrentUser() user: User): Promise<string> {
    this.logger.debug('Application controller: Getting current application')

    let currentApplicationId
    try {
      currentApplicationId =
        await this.applicationService.getCurrentApplicationId(user.nationalId)
    } catch (e) {
      this.logger.error(
        'Application controller: Failed getting current application',
        e,
      )
      throw e
    }

    if (currentApplicationId === null) {
      throw new NotFoundException(404, 'Current application not found')
    }
    return currentApplicationId
  }

  @Scopes(
    MunicipalitiesFinancialAidScope.read,
    MunicipalitiesFinancialAidScope.employee,
  )
  @UseGuards(StaffGuard)
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

  @Scopes(
    MunicipalitiesFinancialAidScope.read,
    MunicipalitiesFinancialAidScope.applicant,
  )
  @Get('spouse')
  @ApiOkResponse({
    type: SpouseResponse,
    description: 'Checking if user is spouse',
  })
  async spouse(@CurrentUser() user: User): Promise<SpouseResponse> {
    this.logger.debug('Application controller: Checking if user is spouse')

    return await this.applicationService.getSpouseInfo(user.nationalId)
  }

  @Scopes(
    MunicipalitiesFinancialAidScope.read,
    MunicipalitiesFinancialAidScope.employee,
  )
  @UseGuards(StaffGuard)
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

  @Scopes(MunicipalitiesFinancialAidScope.read)
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

  @Scopes(
    MunicipalitiesFinancialAidScope.read,
    MunicipalitiesFinancialAidScope.employee,
  )
  @UseGuards(StaffGuard)
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

  @Scopes(MunicipalitiesFinancialAidScope.write)
  @UseGuards(ApplicationGuard)
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

    if (user.scope.includes(MunicipalitiesFinancialAidScope.employee)) {
      staff = await this.staffService.findByNationalId(user.nationalId)
      if (!staff) {
        throw new ForbiddenException('Staff not found')
      }
    }

    if (
      (user.scope.includes(MunicipalitiesFinancialAidScope.applicant) &&
        staffUpdateEvents.includes(applicationToUpdate.event)) ||
      (user.scope.includes(MunicipalitiesFinancialAidScope.employee) &&
        applicantUpdateEvents.includes(applicationToUpdate.event))
    ) {
      throw new ForbiddenException(
        'User not allowed to make this change to application',
      )
    }

    if (user.scope.includes(MunicipalitiesFinancialAidScope.employee)) {
      staff = await this.staffService.findByNationalId(user.nationalId)
    }

    const updatedApplication = await this.applicationService.update(
      id,
      applicationToUpdate,
      staff,
    )

    updatedApplication?.setDataValue('staff', staff)

    return updatedApplication
  }

  @Scopes(
    MunicipalitiesFinancialAidScope.write,
    MunicipalitiesFinancialAidScope.employee,
  )
  @UseGuards(StaffGuard)
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

  @Scopes(
    MunicipalitiesFinancialAidScope.write,
    MunicipalitiesFinancialAidScope.applicant,
  )
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

  @UseGuards(ApplicationGuard)
  @Scopes(MunicipalitiesFinancialAidScope.write)
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
      user.scope.includes(MunicipalitiesFinancialAidScope.employee),
    )

    if (!application) {
      throw new NotFoundException(
        `application ${applicationEvent.applicationId} not found`,
      )
    }

    return application
  }

  @Scopes(
    MunicipalitiesFinancialAidScope.read,
    MunicipalitiesFinancialAidScope.employee,
  )
  @UseGuards(StaffGuard)
  @StaffRolesRules(StaffRole.EMPLOYEE)
  @Post('filter')
  @ApiOkResponse({
    type: FilterApplicationsResponse,
    description: 'Filter applications',
  })
  filter(
    @Body() filters: FilterApplicationsDto,
    @CurrentStaff() staff: Staff,
  ): Promise<FilterApplicationsResponse> {
    this.logger.debug('Application controller: Filter applications')
    return this.applicationService.filter(filters, staff.municipalityIds)
  }

  @Scopes(
    MunicipalitiesFinancialAidScope.read,
    MunicipalitiesFinancialAidScope.applicant,
  )
  @Post('sendSpouseEmail')
  @ApiOkResponse({
    type: SpouseEmailResponse,
    description:
      'Sends email to applicant and spouse to inform that the application is waiting for the spouse',
  })
  async sendSpouseEmail(
    @Body() data: SpouseEmailDto,
  ): Promise<SpouseEmailResponse> {
    this.logger.debug('Application controller: sending spouse email')
    return this.applicationService.sendSpouseEmail(data)
  }
}

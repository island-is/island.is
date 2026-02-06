import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import {
  ApiTags,
} from '@nestjs/swagger'
import { ApplicationsService } from './applications.service'
import {CurrentUser, IdsUserGuard, Scopes} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import {AdminPortalScope} from "@island.is/auth/scopes";
import { ApplicationTypeDto } from "./models/dto/applicationType.dto"
import {InstitutionDto} from "./models/dto/institution.dto";
import {ApplicationResponseDto} from "./models/dto/application.response.dto";

@UseGuards(IdsUserGuard)
@ApiTags('admin')
@Controller({ path: 'admin', version: ['1', VERSION_NEUTRAL] })
export class FormSystemAdminController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  //TODOy add interceptor?
  //TODOy add audit
  @Scopes(AdminPortalScope.applicationSystemAdmin)
  @Get('super-admin/overview/:page/:count')
  async getOverviewForSuperAdmin(
    @Param('page') page: number,
    @Param('count') count: number
  ): Promise<ApplicationResponseDto> {
    return this.applicationsService.findAll(page, count, false)

  }

  @Scopes(AdminPortalScope.applicationSystemInstitution)
  @Get('institution-admin/overview/:page/:count')
  async getOverviewForInstitutionAdmin(
    @CurrentUser() user: User,
    @Param('page') page: number,
    @Param('count') count: number,
  ): Promise<ApplicationResponseDto> {
    return this.applicationsService.findAllByOrganization(user.nationalId, page, count, false)

  }

  @Scopes(AdminPortalScope.applicationSystemAdmin)
  @Get('super-admin/application-types')
  async getApplicationTypesForSuperAdmin(): Promise<ApplicationTypeDto> {
    throw new Error('Method not implemented.')
  }

  @Scopes(AdminPortalScope.applicationSystemInstitution)
  @Get('institution-admin/application-types/')
  async getApplicationTypesForInstitutionAdmin(): Promise<ApplicationTypeDto[]> {
    throw new Error('Method not implemented.')
  }

  @Scopes(AdminPortalScope.applicationSystemAdmin)
  @Get('super-admin/institutions')
  async getInstitutions(): Promise<InstitutionDto[]> {
    throw new Error('Method not implemented.')
  }

  @Scopes(AdminPortalScope.applicationSystemAdmin)
  @Get('super-admin/applications/statistics')
  async getStatisticsForSuperAdmin(): Promise<null> {
    throw new Error('Method not implemented.')
  }

  @Scopes(AdminPortalScope.applicationSystemAdmin)
  @Get('institution-admin/applications/statistics')
  async getStatisticsForInstitutionAdmin(): Promise<null> {
    throw new Error('Method not implemented.')
  }


}

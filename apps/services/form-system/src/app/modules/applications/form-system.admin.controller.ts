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
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { ApplicationsService } from './applications.service'
import { ApplicationDto } from './models/dto/application.dto'
import { CreateApplicationDto } from './models/dto/createApplication.dto'
import { UpdateApplicationDto } from './models/dto/updateApplication.dto'
import { ApplicationResponseDto } from './models/dto/application.response.dto'
import { ScreenValidationResponse } from '../../dataTypes/validationResponse.model'
import {CurrentUser, IdsUserGuard, Scopes} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { ScreenDto } from '../screens/models/dto/screen.dto'
import { SubmitScreenDto } from './models/dto/submitScreen.dto'
import { MyPagesApplicationResponseDto } from './models/dto/myPagesApplication.response.dto'
import type { Locale } from '@island.is/shared/types'
import {AdminPortalScope} from "@island.is/auth/scopes";
import { ApplicationTypeDto } from "./models/dto/applicationType.dto"
import {InstitutionDto} from "./models/dto/institution.dto";
import {ApiScope} from "@island.is/auth/scopes";
import {AdminApplicationCardDto, AdminController} from "admin-interfaces"

@UseGuards(IdsUserGuard)
@ApiTags('admin')
@Controller({ path: 'admin', version: ['1', VERSION_NEUTRAL] })
export class FormSystemAdminController implements AdminController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  //todo add interceptor?
  //todo add audit
  @Scopes(AdminPortalScope.applicationSystemAdmin)
  @Get('super-admin/overview/:page/:count')
  async getOverviewForSuperAdmin(
    @Param('page') page: number,
    @Param('count') count: number
  ): Promise<AdminApplicationCardDto> {
    return this.applicationsService.findAll(page, count, false)

  }

  @Scopes(AdminPortalScope.applicationSystemInstitution)
  @Get('institution-admin/overview/:page/:count')
  async getOverviewForInstitutionAdmin(
    @CurrentUser() user: User,
    @Param('page') page: number,
    @Param('count') count: number,
  ): Promise<AdminApplicationCardDto> {
    return this.applicationsService.findAllByOrganization(user.nationalId, page, count, false)

  }

  @Scopes(AdminPortalScope.applicationSystemAdmin)
  @Get('super-admin/application-types')
  async getApplicationTypesForSuperAdmin(): Promise<ApplicationTypeDto> {

  }

  @Scopes(AdminPortalScope.applicationSystemInstitution)
  @Get('institution-admin/application-types/')
  async getApplicationTypesForInstitutionAdmin(): Promise<ApplicationTypeDto[]> {

  }

  @Scopes(AdminPortalScope.applicationSystemAdmin)
  @Get('super-admin/institutions')
  async getInstitutions(): Promise<InstitutionDto[]> {

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

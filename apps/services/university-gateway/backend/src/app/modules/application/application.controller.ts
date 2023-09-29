import { UseGuards } from '@nestjs/common'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { UniversityGatewayScope } from '@island.is/auth/scopes'
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { ApplicationService } from './application.service'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { Application, ApplicationResponse } from './model'
import { CreateApplicationDto, UpdateApplicationDto } from './dto'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('Application')
@Controller('api')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Scopes(UniversityGatewayScope.main)
  @Get('applications/:id')
  @ApiParam({
    name: 'id',
    required: true,
    allowEmptyValue: false,
    description: 'Application ID',
  })
  @ApiOkResponse({
    type: ApplicationResponse,
    description: 'Returns the application by ID',
  })
  @ApiOperation({
    summary: 'Get application by ID (only status for now) for logged in user',
  })
  async getApplication(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<ApplicationResponse> {
    return this.applicationService.getApplication(id, user)
  }

  @Scopes(UniversityGatewayScope.main)
  @Post('applications')
  @ApiBody({
    type: CreateApplicationDto,
  })
  @ApiCreatedResponse({
    type: Application,
    description: 'Returns the application that was created',
  })
  @ApiOperation({
    summary: 'Create application for logged in user',
  })
  async createApplication(
    @Body() applicationDto: CreateApplicationDto,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.createApplication(applicationDto, user)
  }

  @Scopes(UniversityGatewayScope.main)
  @Patch('applications/:id')
  @ApiParam({
    name: 'id',
    required: true,
    allowEmptyValue: false,
    description: 'Application ID',
  })
  @ApiBody({
    type: UpdateApplicationDto,
  })
  @ApiOkResponse({
    type: Application,
    description: 'Returns the updated application',
  })
  @ApiOperation({
    summary: 'Update application (only status for now) for logged in user',
  })
  async updateApplication(
    @Param('id') id: string,
    @Body() applicationDto: UpdateApplicationDto,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.updateApplication(id, applicationDto, user)
  }
}

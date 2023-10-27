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
import { Application } from './model/application'
import { ApplicationResponse } from './dto/applicationResponse'
import { CreateApplicationDto } from './dto/createApplicationDto'
import { UpdateApplicationDto } from './dto/updateApplicationDto'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(UniversityGatewayScope.main)
@ApiTags('Application')
@Controller({
  path: 'applications',
  version: ['1'],
})
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get(':id')
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
    summary: 'Get application by ID',
  })
  getApplication(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<ApplicationResponse> {
    return this.applicationService.getApplication(id, user)
  }

  @Post()
  @ApiBody({
    type: CreateApplicationDto,
  })
  @ApiCreatedResponse({
    type: Application,
    description: 'Returns the application that was created',
  })
  @ApiOperation({
    summary: 'Create application',
  })
  createApplication(
    @Body() applicationDto: CreateApplicationDto,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.createApplication(applicationDto, user)
  }

  @Patch(':id')
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
    summary: 'Update application status, and extradata (if applies)',
  })
  updateApplication(
    @Param('id') id: string,
    @Body() applicationDto: UpdateApplicationDto,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.updateApplication(id, applicationDto, user)
  }
}

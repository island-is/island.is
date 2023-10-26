import { UseGuards } from '@nestjs/common'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
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
  async getApplication(@Param('id') id: string): Promise<ApplicationResponse> {
    return this.applicationService.getApplication(id)
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
  async createApplication(
    @Body() applicationDto: CreateApplicationDto,
  ): Promise<Application> {
    return this.applicationService.createApplication(applicationDto)
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
  async updateApplication(
    @Param('id') id: string,
    @Body() applicationDto: UpdateApplicationDto,
  ): Promise<Application> {
    return this.applicationService.updateApplication(id, applicationDto)
  }
}

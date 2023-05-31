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
import {
  CreateApplicationDto,
  UpdateApplicationExtradataDto,
  UpdateApplicationStatusDto,
} from './dto'

@ApiTags('Application')
@Controller()
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

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
    summary: 'Get application by ID',
  })
  async getApplication(@Param('id') id: string): Promise<ApplicationResponse> {
    return this.applicationService.getApplication(id)
  }

  @Post('applications')
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

  @Patch('applications/:id/status')
  @ApiParam({
    name: 'id',
    required: true,
    allowEmptyValue: false,
    description: 'Application ID',
  })
  @ApiBody({
    type: UpdateApplicationStatusDto,
  })
  @ApiOkResponse({
    type: Application,
    description: 'Returns the updated application',
  })
  @ApiOperation({
    summary: 'Update application status (used by universities)',
  })
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body() applicationDto: UpdateApplicationStatusDto,
  ): Promise<Application> {
    return this.applicationService.updateApplicationStatus(id, applicationDto)
  }

  @Patch('applications/:id/extradata')
  @ApiParam({
    name: 'id',
    required: true,
    allowEmptyValue: false,
    description: 'Application ID',
  })
  @ApiBody({
    type: UpdateApplicationExtradataDto,
  })
  @ApiOkResponse({
    type: Application,
    description: 'Returns the updated application',
  })
  @ApiOperation({
    summary: 'Update application extradata (used by application system)',
  })
  async updateApplicationExtradata(
    @Param('id') id: string,
    @Body() applicationDto: UpdateApplicationExtradataDto,
  ): Promise<Application> {
    return this.applicationService.updateApplicationExtradata(
      id,
      applicationDto,
    )
  }
}

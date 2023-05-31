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
    description: 'Param description for id',
  })
  @ApiOkResponse({
    type: ApplicationResponse,
    description: 'Response description for 200',
  })
  @ApiOperation({
    summary: 'Endpoint description for get application by id',
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
    description: 'Response description for 201',
  })
  @ApiOperation({
    summary: 'Endpoint description for post application',
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
    description: 'Param description for id',
  })
  @ApiBody({
    type: UpdateApplicationStatusDto,
  })
  @ApiOkResponse({
    type: Application,
    description: 'Response description for 200',
  })
  @ApiOperation({
    summary: 'Endpoint description for patch application status',
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
    description: 'Param description for id',
  })
  @ApiBody({
    type: UpdateApplicationExtradataDto,
  })
  @ApiOkResponse({
    type: Application,
    description: 'Response description for 200',
  })
  @ApiOperation({
    summary: 'Endpoint description for put application extradata',
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

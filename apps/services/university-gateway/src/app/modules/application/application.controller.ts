import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { UniversityGatewayScope } from '@island.is/auth/scopes'
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { ApplicationService } from './application.service'
import { ApiTags } from '@nestjs/swagger'
import { Documentation } from '@island.is/nest/swagger'
import { Application } from './model/application'
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
  @Documentation({
    description:
      'Get application by ID (only status for now) for logged in user',
    response: {
      status: 200,
      type: Application,
    },
    request: {
      params: {
        id: {
          type: 'string',
          description: 'Application ID',
          required: true,
        },
      },
    },
  })
  getApplicationById(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.getApplicationById(id, user)
  }

  @Post()
  @Documentation({
    description: 'Create application for logged in user',
    response: {
      status: 201,
      type: Application,
    },
  })
  createApplication(
    @Body() applicationDto: CreateApplicationDto,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.createApplication(applicationDto, user)
  }

  @Patch(':id')
  @Documentation({
    description: 'Update application (only status for now) for logged in user',
    response: {
      status: 200,
      type: Application,
    },
    request: {
      params: {
        id: {
          type: 'string',
          description: 'Application ID',
          required: true,
        },
      },
    },
  })
  updateApplication(
    @Param('id') id: string,
    @Body() applicationDto: UpdateApplicationDto,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationService.updateApplication(id, applicationDto, user)
  }
}

import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  NotFoundException,
} from '@nestjs/common'

import { ApiOkResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger'

import { ApplicationService } from './application.service'
import { ApplicationModel } from './models'

import { CreateApplicationDto } from './dto'

import { CurrentHttpUser, JwtAuthGuard } from '@island.is/financial-aid/auth'
import { User, Application } from '@island.is/financial-aid/shared'

@UseGuards(JwtAuthGuard)
@Controller('api')
@ApiTags('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get('applications')
  @ApiOkResponse({
    type: ApplicationModel,
    isArray: true,
    description: 'Gets all existing applications',
  })
  getAll(): Promise<ApplicationModel[]> {
    return this.applicationService.getAll()
  }

  @Get('applications/:id')
  @ApiOkResponse({
    type: ApplicationModel,
    description: 'Get applicant',
  })
  async getById(@Param('id') id: string) {
    const applicant = await this.applicationService.findById(id)

    if (!applicant) {
      throw new NotFoundException(`applicant ${id} not found`)
    }

    return applicant
  }

  @Post('application')
  @ApiCreatedResponse({
    type: ApplicationModel,
    description: 'Creates a new application',
  })
  create(
    @CurrentHttpUser() user: User,
    @Body() application: CreateApplicationDto,
  ): Promise<ApplicationModel> {
    return this.applicationService.create(application, user)
  }
}

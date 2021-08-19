import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Put,
  NotFoundException,
  Query,
} from '@nestjs/common'

import { ApiOkResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger'

import { ApplicationService } from './application.service'
import { ApplicationModel } from './models'

import { CreateApplicationDto, UpdateApplicationDto } from './dto'

import {
  CurrentHttpUser,
  JwtAuthGuard,
  TokenGuard,
} from '@island.is/financial-aid/auth'
import type { User, ApplicationFilters } from '@island.is/financial-aid/shared'
import { ApplicationEventService } from '../applicationEvent'

@Controller('api')
@ApiTags('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @UseGuards(TokenGuard)
  @Get('hasAppliedForPeriod')
  @ApiOkResponse({
    description:
      'Checks whether user has applied before and if it is the same month',
  })
  async getHasAppliedForPeriod(@Query('nationalId') nationalId: string) {
    const hasApplied = await this.applicationService.hasAppliedForPeriod(
      nationalId,
    )
    return hasApplied
  }

  @UseGuards(JwtAuthGuard)
  @Get('applications')
  @ApiOkResponse({
    type: ApplicationModel,
    isArray: true,
    description: 'Gets all existing applications',
  })
  getAll(): Promise<ApplicationModel[]> {
    return this.applicationService.getAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get('applications/:id')
  @ApiOkResponse({
    type: ApplicationModel,
    description: 'Get application',
  })
  async getById(@Param('id') id: string) {
    const application = await this.applicationService.findById(id)

    if (!application) {
      throw new NotFoundException(`application ${id} not found`)
    }

    return application
  }

  @UseGuards(JwtAuthGuard)
  @Get('applicationsFilters')
  @ApiOkResponse({
    description: 'Gets all existing applications filters',
  })
  getAllFilters(): Promise<ApplicationFilters> {
    return this.applicationService.getAllFilters()
  }

  @UseGuards(JwtAuthGuard)
  @Put('applications/:id')
  @ApiOkResponse({
    type: ApplicationModel,
    description: 'Updates an existing application',
  })
  async update(
    @Param('id') id: string,
    @Body() applicationToUpdate: UpdateApplicationDto,
  ): Promise<ApplicationModel> {
    const {
      numberOfAffectedRows,
      updatedApplication,
    } = await this.applicationService.update(id, applicationToUpdate)

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Application ${id} does not exist`)
    }

    return updatedApplication
  }

  @UseGuards(JwtAuthGuard)
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

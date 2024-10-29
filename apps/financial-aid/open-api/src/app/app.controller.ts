import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Inject,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { FilterApplicationsDto } from './app.dto'
import { AppService } from './app.service'
import { ApplicationBackendModel } from './backendModels'
import { ApplicationModel, PdfModel } from './models'

@Controller('api/open/v1')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('applications')
  @ApiCreatedResponse({
    type: [ApplicationBackendModel],
    description: 'Gets application for municipality',
  })
  async getApplication(
    @Headers('API-Key') apiKey: string,
    @Headers('Municipality-Code') municipalityCode: string,
    @Query() filters: FilterApplicationsDto,
  ): Promise<ApplicationModel[]> {
    this.logger.info('Gets all application')
    return this.appService
      .getApplications(apiKey, municipalityCode, filters)
      .then((applications) => {
        this.logger.info(`Application fetched`)
        return applications
      })
  }

  @Get('pdf')
  @ApiCreatedResponse({
    type: PdfModel,
    description: 'Gets application from id and returns pdf',
  })
  async getPdf(
    @Headers('API-Key') apiKey: string,
    @Headers('Municipality-Code') municipalityCode: string,
    @Query('id') id: string,
  ): Promise<PdfModel> {
    if (!id) {
      throw new BadRequestException('Application ID is required')
    }
    this.logger.info('Gets one application and returns pdf')
    return this.appService
      .getApplicationPdfById(apiKey, municipalityCode, id)
      .then((application) => {
        this.logger.info(`Application fetched and returned as pdf`)
        if (!application.file) {
          throw new NotFoundException(`Application ${id} not found`)
        }
        return application
      })
      .catch((error) => {
        if (error instanceof NotFoundException) {
          this.logger.warn(`Application ${id} not found`)
        } else {
          this.logger.error(
            `Failed to generate PDF for application ${id}`,
            error,
          )
        }
        throw error
      })
  }
}

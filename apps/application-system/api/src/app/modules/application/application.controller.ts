import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { callDataProviders } from '@island.is/application/data-provider'
import { FormType } from '@island.is/application/schema'
import { Application } from './application.model'
import { ApplicationService } from './application.service'
import { CreateApplicationDto } from './dto/createApplication.dto'
import { UpdateApplicationDto } from './dto/updateApplication.dto'
import { SchemaValidationPipe } from './pipes/schemaValidation.pipe'
import { PopulateExternalDataDto } from './dto/populateExternalData.dto'
import { buildDataProviders, buildExternalData } from './externalDataUtils'

@ApiTags('application')
@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get(':id')
  @ApiOkResponse({ type: Application })
  async findOne(@Param('id') id: string): Promise<Application> {
    const application = await this.applicationService.findById(id)

    if (!application) {
      throw new NotFoundException("This application doesn't exist")
    }

    return application
  }

  @Get()
  @ApiOkResponse({ type: Application, isArray: true })
  async findAll(@Query('typeId') typeId: string): Promise<Application[]> {
    if (typeId) {
      return this.applicationService.findAllByType(typeId as FormType)
    } else {
      return this.applicationService.findAll()
    }
  }

  @Post()
  @ApiCreatedResponse({ type: Application })
  async create(
    @Body(new SchemaValidationPipe(true))
    application: CreateApplicationDto,
  ): Promise<Application> {
    return this.applicationService.create(application)
  }

  @Put(':id')
  @ApiOkResponse({ type: Application })
  async update(
    @Param('id') id: string,
    @Body(new SchemaValidationPipe(true))
    application: UpdateApplicationDto,
  ): Promise<Application> {
    const {
      numberOfAffectedRows,
      updatedApplication,
    } = await this.applicationService.update(id, application)

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(
        `An application with the id ${id} does not exist`,
      )
    }

    return updatedApplication
  }

  @Put(':id/externalData')
  @ApiOkResponse({ type: Application })
  async updateExternalData(
    @Param('id') id: string,
    @Body()
    externalDataDto: PopulateExternalDataDto,
  ): Promise<Application> {
    const application = await this.applicationService.findById(id)

    if (!application) {
      throw new NotFoundException("This application doesn't exist")
    }
    const results = await callDataProviders(buildDataProviders(externalDataDto))
    const {
      numberOfAffectedRows,
      updatedApplication,
    } = await this.applicationService.updateExternalData(
      id,
      buildExternalData(externalDataDto, results),
    )
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(
        `An application with the id ${id} does not exist`,
      )
    }

    return updatedApplication
  }
}

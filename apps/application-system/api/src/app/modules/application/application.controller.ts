import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Delete,
  Query,
  ParseUUIDPipe,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common'
import { omit } from 'lodash'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import {
  Application as BaseApplication,
  callDataProviders,
  ApplicationTypes,
  FormValue,
  getApplicationTemplateByTypeId,
  ApplicationTemplateHelper,
} from '@island.is/application/template'
import { Application } from './application.model'
import { ApplicationService } from './application.service'
import { CreateApplicationDto } from './dto/createApplication.dto'
import { UpdateApplicationDto } from './dto/updateApplication.dto'
import { AddAttachmentDto } from './dto/addAttachment.dto'
import { mergeAnswers } from '@island.is/application/template'
import { DeleteAttachmentDto } from './dto/deleteAttachment.dto'
import { PopulateExternalDataDto } from './dto/populateExternalData.dto'
import { buildDataProviders, buildExternalData } from './externalDataUtils'
import { ApplicationByIdPipe } from './tools/applicationById.pipe'
import { validateApplicationSchema } from './schemaValidationUtils'
import { ApplicationSerializer } from './tools/application.serializer'

@ApiTags('application')
@Controller('application')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    @InjectQueue('upload')
    private readonly uploadQueue: Queue,
  ) {}

  @Get(':id')
  @ApiOkResponse({ type: Application })
  @UseInterceptors(ApplicationSerializer)
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Application> {
    const application = await this.applicationService.findById(id)

    if (!application) {
      throw new NotFoundException(
        `An application with the id ${id} does not exist`,
      )
    }

    return application
  }
  // TODO REMOVE
  @Get()
  @ApiOkResponse({ type: Application, isArray: true })
  async findAll(@Query('typeId') typeId: string): Promise<Application[]> {
    if (typeId) {
      return this.applicationService.findAllByType(typeId as ApplicationTypes)
    } else {
      return this.applicationService.findAll()
    }
  }

  @Post()
  @ApiCreatedResponse({ type: Application })
  @UseInterceptors(ApplicationSerializer)
  async create(
    @Body()
    application: CreateApplicationDto,
  ): Promise<Application> {
    validateApplicationSchema(
      {
        ...application,
        externalData: {},
        id: undefined,
        modified: new Date(),
        created: new Date(),
      } as BaseApplication,
      application.answers as FormValue,
    )
    return this.applicationService.create(application)
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to update.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: Application })
  @UseInterceptors(ApplicationSerializer)
  async update(
    @Param('id', new ParseUUIDPipe(), ApplicationByIdPipe)
    existingApplication: Application,
    @Body()
    application: UpdateApplicationDto,
  ): Promise<Application> {
    validateApplicationSchema(
      existingApplication as BaseApplication,
      application.answers as FormValue,
    )
    const mergedAnswers = mergeAnswers(
      existingApplication.answers,
      application.answers,
    )
    const { updatedApplication } = await this.applicationService.update(
      existingApplication.id,
      {
        ...application,
        answers: mergedAnswers,
      },
    )

    return updatedApplication
  }

  @Put(':id/externalData')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to update the external data for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: Application })
  @UseInterceptors(ApplicationSerializer)
  async updateExternalData(
    @Param('id', new ParseUUIDPipe(), ApplicationByIdPipe)
    existingApplication: Application,
    @Body()
    externalDataDto: PopulateExternalDataDto,
  ): Promise<Application> {
    // TODO how can we know if the requested data-providers are actually associated with this given form?
    const results = await callDataProviders(
      buildDataProviders(externalDataDto),
      existingApplication as BaseApplication,
    )
    const {
      updatedApplication,
    } = await this.applicationService.updateExternalData(
      existingApplication.id,
      buildExternalData(externalDataDto, results),
    )
    if (!updatedApplication) {
      throw new NotFoundException(
        `An application with the id ${existingApplication.id} does not exist`,
      )
    }

    return updatedApplication
  }

  @Put(':id/submit')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to update the state for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: Application })
  @UseInterceptors(ApplicationSerializer)
  async submitApplication(
    @Param('id', new ParseUUIDPipe(), ApplicationByIdPipe)
    existingApplication: Application,
    @Body() event: string,
  ): Promise<Application> {
    const template = getApplicationTemplateByTypeId(
      existingApplication.typeId as ApplicationTypes,
    )
    if (template === null) {
      throw new BadRequestException(
        `No application template exists for type: ${existingApplication.typeId}`,
      )
    }

    const helper = new ApplicationTemplateHelper(
      existingApplication as BaseApplication,
      template,
    )
    const newState = helper.changeState(event)

    if (newState.changed) {
      const {
        updatedApplication,
      } = await this.applicationService.updateApplicationState(
        existingApplication.id,
        newState.value.toString(), // TODO maybe ban more complicated states....
      )

      return updatedApplication
    }

    return existingApplication
  }

  @Put(':id/attachments')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to update the attachments for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: Application })
  @UseInterceptors(ApplicationSerializer)
  async addAttachment(
    @Param('id', new ParseUUIDPipe(), ApplicationByIdPipe)
    existingApplication: Application,
    @Body() input: AddAttachmentDto,
  ): Promise<Application> {
    const { key, url } = input

    const { updatedApplication } = await this.applicationService.update(
      existingApplication.id,
      {
        attachments: {
          ...existingApplication.attachments,
          [key]: url,
        },
      },
    )

    await this.uploadQueue.add('upload', {
      applicationId: existingApplication.id,
      attachmentUrl: url,
    })

    return updatedApplication
  }

  @Delete(':id/attachments')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to delete attachment(s) from.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: Application })
  @UseInterceptors(ApplicationSerializer)
  async deleteAttachment(
    @Param('id', new ParseUUIDPipe(), ApplicationByIdPipe)
    existingApplication: Application,
    @Body() input: DeleteAttachmentDto,
  ): Promise<Application> {
    const { key } = input

    const { updatedApplication } = await this.applicationService.update(
      existingApplication.id,
      {
        attachments: omit(existingApplication.attachments, key),
      },
    )

    return updatedApplication
  }
}

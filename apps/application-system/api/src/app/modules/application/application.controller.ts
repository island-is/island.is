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
} from '@nestjs/common'
import { omit } from 'lodash'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { Application } from './application.model'
import { ApplicationService } from './application.service'
import { CreateApplicationDto } from './dto/createApplication.dto'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { UpdateApplicationDto } from './dto/updateApplication.dto'
import { ApplicationValidationPipe } from './application.pipe'
import { AddAttachmentDto } from './dto/addAttachment.dto'
import { mergeAnswers } from '@island.is/application/schema'
import { DeleteAttachmentDto } from './dto/deleteAttachment.dto'
import { FormType } from '@island.is/application/schema'

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
    @Body(new ApplicationValidationPipe(true))
    application: CreateApplicationDto,
  ): Promise<Application> {
    return this.applicationService.create(application)
  }

  @Put(':id')
  @ApiOkResponse({ type: Application })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ApplicationValidationPipe(true))
    application: UpdateApplicationDto,
  ): Promise<Application> {
    const existingApplication = await this.applicationService.findById(id)

    if (!existingApplication) {
      throw new NotFoundException(
        `An application with the id ${id} does not exist`,
      )
    }

    const mergedAnswers = mergeAnswers(
      existingApplication.answers,
      application.answers,
    )
    const { updatedApplication } = await this.applicationService.update(id, {
      ...application,
      answers: mergedAnswers,
    })

    return updatedApplication
  }

  @Put(':id/attachments')
  @ApiOkResponse({ type: Application })
  async addAttachment(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: AddAttachmentDto,
  ): Promise<Application> {
    const { key, url } = input
    const existingApplication = await this.applicationService.findById(id)

    if (!existingApplication) {
      throw new NotFoundException(
        `An application with the id ${id} does not exist`,
      )
    }

    const { updatedApplication } = await this.applicationService.update(id, {
      attachments: {
        ...existingApplication.attachments,
        [key]: url,
      },
    })

    await this.uploadQueue.add('upload', {
      applicationId: id,
      attachmentUrl: url,
    })

    return updatedApplication
  }

  @Delete(':id/attachments')
  @ApiOkResponse({ type: Application })
  async deleteAttachment(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: DeleteAttachmentDto,
  ): Promise<Application> {
    const { key } = input
    const existingApplication = await this.applicationService.findById(id)

    if (!existingApplication) {
      throw new NotFoundException(
        `An application with the id ${id} does not exist`,
      )
    }

    const { updatedApplication } = await this.applicationService.update(id, {
      attachments: omit(existingApplication.attachments, key),
    })

    return updatedApplication
  }
}

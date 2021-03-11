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
  Optional,
} from '@nestjs/common'

import omit from 'lodash/omit'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { WhereOptions } from 'sequelize/types'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiQuery,
  ApiHeader,
} from '@nestjs/swagger'
import { Op } from 'sequelize'
import {
  Application as BaseApplication,
  callDataProviders,
  ApplicationTypes,
  FormValue,
  ApplicationTemplateHelper,
  ExternalData,
  RecordObject,
  ApplicationTemplateAPIAction,
} from '@island.is/application/core'
import { Unwrap } from '@island.is/shared/types'
// import { IdsAuthGuard, ScopesGuard, User } from '@island.is/auth-nest-tools'
import {
  getApplicationDataProviders,
  getApplicationTemplateByTypeId,
} from '@island.is/application/template-loader'
import { TemplateAPIService } from '@island.is/application/template-api-modules'

import { Application } from './application.model'
import { ApplicationService } from './application.service'
import { FileService } from './files/file.service'
import { CreateApplicationDto } from './dto/createApplication.dto'
import { UpdateApplicationDto } from './dto/updateApplication.dto'
import { AddAttachmentDto } from './dto/addAttachment.dto'
import { mergeAnswers, DefaultEvents } from '@island.is/application/core'
import { DeleteAttachmentDto } from './dto/deleteAttachment.dto'
import { CreatePdfDto } from './dto/createPdf.dto'
import { PopulateExternalDataDto } from './dto/populateExternalData.dto'
import {
  buildDataProviders,
  buildExternalData,
} from './utils/externalDataUtils'
import { ApplicationByIdPipe } from './tools/applicationById.pipe'
import {
  validateApplicationSchema,
  validateIncomingAnswers,
  validateIncomingExternalDataProviders,
} from './utils/validationUtils'
import { ApplicationSerializer } from './tools/application.serializer'
import { UpdateApplicationStateDto } from './dto/updateApplicationState.dto'
import { ApplicationResponseDto } from './dto/application.response.dto'
import { AssignApplicationDto } from './dto/assignApplication.dto'
import { NationalId } from './tools/nationalId.decorator'
import { AuthorizationHeader } from './tools/authorizationHeader.decorator'
import { verifyToken } from './utils/tokenUtils'
import { response } from 'express'

// @UseGuards(IdsAuthGuard, ScopesGuard) TODO uncomment when IdsAuthGuard is fixes, always returns Unauthorized atm

interface DecodedAssignmentToken {
  applicationId: string
  state: string
}

interface StateChangeResult {
  error?: string
  hasError: boolean
  hasChanged: boolean
  application: BaseApplication
}

interface ModuleActionResult {
  error?: string
  response?: unknown
  success: boolean
}

@ApiTags('applications')
@ApiHeader({
  name: 'authorization',
  description: 'Bearer token authorization',
})
@Controller()
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly templateAPIService: TemplateAPIService,
    private readonly fileService: FileService,
    @Optional() @InjectQueue('upload') private readonly uploadQueue: Queue,
  ) {}

  @Get('applications/:id')
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ApplicationResponseDto> {
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
  @ApiOkResponse({ type: ApplicationResponseDto, isArray: true })
  @UseInterceptors(ApplicationSerializer)
  async findAll(
    @Query('typeId') typeId: string,
  ): Promise<ApplicationResponseDto[]> {
    if (typeId) {
      return this.applicationService.findAllByType(typeId as ApplicationTypes)
    } else {
      return this.applicationService.findAll()
    }
  }

  @Get('applicants/:nationalRegistryId/applications')
  @ApiQuery({
    name: 'typeId',
    required: false,
    type: String,
  })
  @ApiOkResponse({ type: ApplicationResponseDto, isArray: true })
  @UseInterceptors(ApplicationSerializer)
  async findApplicantApplications(
    @Param('nationalRegistryId') nationalRegistryId: string,
    @Query('typeId') typeId?: string,
  ): Promise<ApplicationResponseDto[]> {
    const whereOptions: WhereOptions = {
      applicant: nationalRegistryId,
    }

    if (typeId) {
      whereOptions.typeId = typeId
    }

    return this.applicationService.findAll({
      where: whereOptions,
    })
  }

  @Get('assignees/:nationalRegistryId/applications')
  @ApiQuery({
    name: 'typeId',
    required: false,
    type: String,
  })
  @ApiOkResponse({ type: ApplicationResponseDto, isArray: true })
  @UseInterceptors(ApplicationSerializer)
  async findAssigneeApplications(
    @Param('nationalRegistryId') nationalRegistryId: string,
    @Query('typeId') typeId?: string,
  ): Promise<Application[]> {
    const whereOptions: WhereOptions = {
      assignees: {
        [Op.contains]: [nationalRegistryId],
      },
    }

    if (typeId) {
      whereOptions.typeId = typeId
    }

    return this.applicationService.findAll({
      where: whereOptions,
    })
  }

  @Post('applications')
  @ApiCreatedResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async create(
    @Body()
    application: CreateApplicationDto,
  ): Promise<ApplicationResponseDto> {
    // TODO not post the state, it should follow the initialstate of the machine
    await validateApplicationSchema(
      application,
      application.answers as FormValue,
    )

    return this.applicationService.create(application)
  }

  @Put('applications/assign')
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async assignApplication(
    @Body() assignApplicationDto: AssignApplicationDto,
    @NationalId() nationalId: string,
    @AuthorizationHeader() authorization: string,
  ): Promise<ApplicationResponseDto> {
    const decodedToken = verifyToken<DecodedAssignmentToken>(
      assignApplicationDto.token,
    )

    if (decodedToken === null) {
      throw new BadRequestException('Invalid token')
    }

    const existingApplication = await this.applicationService.findById(
      decodedToken.applicationId,
    )

    if (existingApplication === null) {
      throw new NotFoundException('No application found')
    }

    if (existingApplication.state !== decodedToken.state) {
      throw new NotFoundException('Application no longer in assignable state')
    }

    // TODO check if assignee is still the same?
    // decodedToken.assignedEmail === get(existingApplication.answers, decodedToken.emailPath)
    // throw new BadRequestException('Invalid token')

    const templateId = existingApplication.typeId as ApplicationTypes
    const template = await getApplicationTemplateByTypeId(templateId)

    // TODO
    if (template === null) {
      throw new BadRequestException(
        `No application template exists for type: ${existingApplication.typeId}`,
      )
    }

    const assignees = [nationalId]

    const mergedApplication: BaseApplication = {
      ...(existingApplication.toJSON() as BaseApplication),
      assignees,
    }

    const {
      hasChanged,
      hasError,
      error,
      application: updatedApplication,
    } = await this.changeState(
      mergedApplication,
      template,
      DefaultEvents.ASSIGN,
      authorization,
    )

    if (hasError) {
      throw new BadRequestException(error)
    }

    if (hasChanged) {
      return updatedApplication
    }

    return existingApplication
  }

  @Put('applications/:id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to update.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async update(
    @Param('id', new ParseUUIDPipe(), ApplicationByIdPipe)
    existingApplication: Application,
    @Body()
    application: UpdateApplicationDto,
    @NationalId() nationalId: string,
  ): Promise<ApplicationResponseDto> {
    const newAnswers = application.answers as FormValue

    await validateIncomingAnswers(
      existingApplication as BaseApplication,
      newAnswers,
      nationalId,
      true,
    )

    await validateApplicationSchema(
      existingApplication as BaseApplication,
      newAnswers,
    )

    const mergedAnswers = mergeAnswers(existingApplication.answers, newAnswers)
    const { updatedApplication } = await this.applicationService.update(
      existingApplication.id,
      {
        ...application,
        answers: mergedAnswers,
      },
    )

    return updatedApplication
  }

  @Put('applications/:id/externalData')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to update the external data for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async updateExternalData(
    @Param('id', new ParseUUIDPipe(), ApplicationByIdPipe)
    existingApplication: Application,
    @Body()
    externalDataDto: PopulateExternalDataDto,
    @AuthorizationHeader() authorization: string,
    @NationalId() nationalId: string,
  ): Promise<ApplicationResponseDto> {
    await validateIncomingExternalDataProviders(
      existingApplication as BaseApplication,
      externalDataDto,
      nationalId,
    )
    const templateDataProviders = await getApplicationDataProviders(
      (existingApplication as BaseApplication).typeId,
    )

    const results = await callDataProviders(
      buildDataProviders(
        externalDataDto,
        templateDataProviders,
        authorization ?? '',
      ),
      existingApplication as BaseApplication,
    )
    const {
      updatedApplication,
    } = await this.applicationService.updateExternalData(
      existingApplication.id,
      existingApplication.externalData as ExternalData,
      buildExternalData(externalDataDto, results),
    )
    if (!updatedApplication) {
      throw new NotFoundException(
        `An application with the id ${existingApplication.id} does not exist`,
      )
    }

    return updatedApplication
  }

  @Put('applications/:id/submit')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to update the state for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async submitApplication(
    @Param('id', new ParseUUIDPipe(), ApplicationByIdPipe)
    existingApplication: Application,
    @Body() updateApplicationStateDto: UpdateApplicationStateDto,
    @NationalId() nationalId: string,
    @AuthorizationHeader() authorization: string,
  ): Promise<ApplicationResponseDto> {
    const templateId = existingApplication.typeId as ApplicationTypes
    const template = await getApplicationTemplateByTypeId(templateId)
    // TODO
    if (template === null) {
      throw new BadRequestException(
        `No application template exists for type: ${existingApplication.typeId}`,
      )
    }

    const newAnswers = (updateApplicationStateDto.answers ?? {}) as FormValue

    const permittedAnswers = await validateIncomingAnswers(
      existingApplication as BaseApplication,
      newAnswers,
      nationalId,
      false,
    )

    await validateApplicationSchema(
      existingApplication as BaseApplication,
      permittedAnswers,
    )
    const mergedAnswers = mergeAnswers(
      existingApplication.answers,
      permittedAnswers,
    )

    const mergedApplication: BaseApplication = {
      ...(existingApplication.toJSON() as BaseApplication),
      answers: mergedAnswers,
    }

    const {
      hasChanged,
      hasError,
      error,
      application: updatedApplication,
    } = await this.changeState(
      mergedApplication,
      template,
      updateApplicationStateDto.event,
      authorization,
    )

    if (hasError) {
      throw new BadRequestException(error)
    }

    if (hasChanged) {
      return updatedApplication
    }

    return existingApplication
  }

  async performActionOnApplication(
    application: BaseApplication,
    template: Unwrap<typeof getApplicationTemplateByTypeId>,
    authorization: string,
    action: ApplicationTemplateAPIAction,
  ): Promise<ModuleActionResult> {
    const { apiModuleAction } = action

    const actionResult = await this.templateAPIService.performAction({
      templateId: template.type,
      type: apiModuleAction,
      props: {
        application,
        authorization,
      },
    })

    if (!actionResult.success) {
      return actionResult
    }

    const newExternalDataEntry: ExternalData = {
      [apiModuleAction]: {
        status: 'success',
        date: new Date(),
        data: actionResult.response as ExternalData['data'],
      },
    }

    console.log('new external data entry')
    console.log(JSON.stringify(newExternalDataEntry))

    await this.applicationService.updateExternalData(
      application.id,
      application.externalData,
      newExternalDataEntry,
    )

    application.externalData = {
      ...application.externalData,
      ...newExternalDataEntry,
    }

    return actionResult
  }

  async changeState(
    application: BaseApplication,
    template: Unwrap<typeof getApplicationTemplateByTypeId>,
    event: string,
    authorization: string,
  ): Promise<StateChangeResult> {
    const helper = new ApplicationTemplateHelper(application, template)

    const beforeLeaveAction = helper.getStateBeforeLeave(application.state)

    if (beforeLeaveAction) {
      const { success, error } = await this.performActionOnApplication(
        application,
        template,
        authorization,
        beforeLeaveAction,
      )

      if (!success) {
        return {
          hasChanged: false,
          application,
          error,
          hasError: !!error,
        }
      }
    }

    const [hasChanged, newState, newApplication] = helper.changeState(event)

    if (!hasChanged) {
      return {
        hasChanged: false,
        hasError: false,
        application,
      }
    }

    let updatedApplication: BaseApplication

    try {
      console.log('about to save')
      const update = await this.applicationService.updateApplicationState(
        application.id,
        newState,
        newApplication.answers,
        newApplication.assignees,
      )

      updatedApplication = update.updatedApplication as BaseApplication
    } catch (e) {
      console.error('Could not update application', e)

      return {
        hasChanged: false,
        hasError: true,
        application,
        error: 'Could not update application',
      }
    }

    const newStateOnEntry = helper.getStateOnEntry(newState)

    if (newStateOnEntry !== null) {
      const { success, error } = await this.performActionOnApplication(
        updatedApplication,
        template,
        authorization,
        newStateOnEntry,
      )

      if (!success) {
        return {
          hasChanged: true,
          application: updatedApplication,
          hasError: true,
          error,
        }
      }

      try {
        const update = await this.applicationService.updateApplicationState(
          application.id,
          newState,
          newApplication.answers,
          newApplication.assignees,
        )

        updatedApplication = update.updatedApplication as BaseApplication
      } catch (e) {
        console.error('Could not update application', e)

        return {
          hasChanged: false,
          hasError: true,
          application,
          error: 'Could not update application',
        }
      }
    }

    return {
      hasChanged: true,
      application: updatedApplication,
      hasError: false,
    }
  }

  @Put('applications/:id/attachments')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to update the attachments for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async addAttachment(
    @Param('id', new ParseUUIDPipe(), ApplicationByIdPipe)
    existingApplication: Application,
    @Body() input: AddAttachmentDto,
  ): Promise<ApplicationResponseDto> {
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

  @Delete('applications/:id/attachments')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to delete attachment(s) from.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async deleteAttachment(
    @Param('id', new ParseUUIDPipe(), ApplicationByIdPipe)
    existingApplication: Application,
    @Body() input: DeleteAttachmentDto,
  ): Promise<ApplicationResponseDto> {
    const { key } = input

    const { updatedApplication } = await this.applicationService.update(
      existingApplication.id,
      {
        attachments: omit(existingApplication.attachments, key),
      },
    )

    return updatedApplication
  }

  @Put('application/:id/createPdf')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to update the state for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async createPdf(
    @Param('id', new ParseUUIDPipe(), ApplicationByIdPipe)
    application: Application,
    @Body() input: CreatePdfDto,
  ): Promise<ApplicationResponseDto> {
    const { type } = input

    const url = await this.fileService.createPdf(application, type)

    const { updatedApplication } = await this.applicationService.update(
      application.id,
      {
        attachments: {
          ...application.attachments,
          [type]: url,
        },
      },
    )

    return updatedApplication
  }
}

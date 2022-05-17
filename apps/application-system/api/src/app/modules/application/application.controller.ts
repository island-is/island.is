import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  ParseUUIDPipe,
  BadRequestException,
  UseInterceptors,
  Optional,
  Query,
  UseGuards,
  UnauthorizedException,
  Delete,
  ForbiddenException,
} from '@nestjs/common'
import omit from 'lodash/omit'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger'
import {
  ApplicationWithAttachments as BaseApplication,
  callDataProviders,
  ApplicationTypes,
  FormValue,
  ApplicationTemplateHelper,
  ExternalData,
  ApplicationTemplateAPIAction,
  PdfTypes,
  ApplicationStatus,
  CustomTemplateFindQuery,
} from '@island.is/application/core'
import type { Unwrap, Locale } from '@island.is/shared/types'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'
import {
  getApplicationDataProviders,
  getApplicationTemplateByTypeId,
  getApplicationTranslationNamespaces,
} from '@island.is/application/template-loader'
import { TemplateAPIService } from '@island.is/application/template-api-modules'
import { mergeAnswers, DefaultEvents } from '@island.is/application/core'
import { IntlService } from '@island.is/cms-translations'
import { Audit, AuditService } from '@island.is/nest/audit'

import { ApplicationService } from '@island.is/application/api/core'
import { FileService } from './files/file.service'
import { CreateApplicationDto } from './dto/createApplication.dto'
import { UpdateApplicationDto } from './dto/updateApplication.dto'
import { AddAttachmentDto } from './dto/addAttachment.dto'
import { DeleteAttachmentDto } from './dto/deleteAttachment.dto'
import { GeneratePdfDto } from './dto/generatePdf.dto'
import { PopulateExternalDataDto } from './dto/populateExternalData.dto'
import { RequestFileSignatureDto } from './dto/requestFileSignature.dto'
import { UploadSignedFileDto } from './dto/uploadSignedFile.dto'
import {
  buildDataProviders,
  buildExternalData,
} from './utils/externalDataUtils'
import { ApplicationValidationService } from './tools/applicationTemplateValidation.service'
import { ApplicationSerializer } from './tools/application.serializer'
import { UpdateApplicationStateDto } from './dto/updateApplicationState.dto'
import { ApplicationResponseDto } from './dto/application.response.dto'
import { PresignedUrlResponseDto } from './dto/presignedUrl.response.dto'
import { RequestFileSignatureResponseDto } from './dto/requestFileSignature.response.dto'
import { UploadSignedFileResponseDto } from './dto/uploadSignedFile.response.dto'
import { AssignApplicationDto } from './dto/assignApplication.dto'
import { verifyToken } from './utils/tokenUtils'
import { getApplicationLifecycle } from './utils/application'
import {
  DecodedAssignmentToken,
  StateChangeResult,
  TemplateAPIModuleActionResult,
} from './types'
import { ApplicationAccessService } from './tools/applicationAccess.service'
import { CurrentLocale } from './utils/currentLocale'
import { Application } from '@island.is/application/api/core'
import { Documentation } from '@island.is/nest/swagger'
import { TemplateApiActionRunner } from './tools/templateApiActionRunner.service'
@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('applications')
@ApiHeader({
  name: 'authorization',
  description: 'Bearer token authorization',
})
@ApiHeader({
  name: 'locale',
  description: 'Front-end language selected',
})
@Controller()
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly templateAPIService: TemplateAPIService,
    private readonly fileService: FileService,
    private readonly auditService: AuditService,
    private readonly validationService: ApplicationValidationService,
    private readonly applicationAccessService: ApplicationAccessService,
    @Optional() @InjectQueue('upload') private readonly uploadQueue: Queue,
    private intlService: IntlService,
    private readonly templateApiActionRunner: TemplateApiActionRunner,
  ) {}

  @Scopes(ApplicationScope.read)
  @Get('applications/:id')
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  @Audit<ApplicationResponseDto>({
    resources: (app) => app.id,
  })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: User,
  ): Promise<ApplicationResponseDto> {
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user.nationalId,
    )

    await this.validationService.validateThatApplicationIsReady(
      existingApplication as BaseApplication,
      user,
    )

    return existingApplication
  }

  @Scopes(ApplicationScope.read)
  @Get('users/:nationalId/applications')
  @ApiParam({
    name: 'nationalId',
    type: String,
    required: true,
    description: `To get the applications for a specific user's national id.`,
    allowEmptyValue: false,
  })
  @ApiQuery({
    name: 'typeId',
    required: false,
    type: 'string',
    description:
      'To filter applications by type. Comma-separated for multiple values.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: 'string',
    description:
      'To filter applications by status. Comma-separated for multiple values.',
  })
  @ApiOkResponse({ type: ApplicationResponseDto, isArray: true })
  @UseInterceptors(ApplicationSerializer)
  @Audit<ApplicationResponseDto[]>({
    resources: (apps) => apps.map((app) => app.id),
  })
  async findAll(
    @Param('nationalId') nationalId: string,
    @CurrentUser() user: User,
    @Query('typeId') typeId?: string,
    @Query('status') status?: string,
  ): Promise<ApplicationResponseDto[]> {
    if (nationalId !== user.nationalId) {
      throw new UnauthorizedException()
    }

    const applications = await this.applicationService.findAllByNationalIdAndFilters(
      nationalId,
      typeId,
      status,
    )

    const templateTypeToIsReady: Partial<Record<ApplicationTypes, boolean>> = {}
    const filteredApplications: Application[] = []

    for (const application of applications) {
      // We've already checked an application with this type and it is ready
      if (templateTypeToIsReady[application.typeId]) {
        filteredApplications.push(application)
        continue
      } else if (templateTypeToIsReady[application.typeId] === false) {
        // We've already checked an application with this type
        // and it is NOT ready so we will skip it
        continue
      }

      const applicationTemplate = await getApplicationTemplateByTypeId(
        application.typeId,
      )

      if (
        await this.validationService.isTemplateReady(user, applicationTemplate)
      ) {
        templateTypeToIsReady[application.typeId] = true
        filteredApplications.push(application)
      } else {
        templateTypeToIsReady[application.typeId] = false
      }
    }

    return filteredApplications
  }

  @Scopes(ApplicationScope.write)
  @Post('applications')
  @ApiCreatedResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  async create(
    @Body()
    application: CreateApplicationDto,
    @CurrentUser()
    user: User,
  ): Promise<ApplicationResponseDto> {
    const { typeId } = application
    const template = await getApplicationTemplateByTypeId(typeId)

    if (template === null) {
      throw new BadRequestException(
        `No application template exists for type: ${typeId}`,
      )
    }

    // TODO: verify template is ready from https://github.com/island-is/island.is/pull/3297

    // TODO: initial state should be required
    const initialState =
      template.stateMachineConfig.initial ??
      Object.keys(template.stateMachineConfig.states)[0]

    if (typeof initialState !== 'string') {
      throw new BadRequestException(
        `No initial state found for type: ${typeId}`,
      )
    }

    const applicationDto: Pick<
      BaseApplication,
      | 'answers'
      | 'applicant'
      | 'assignees'
      | 'attachments'
      | 'state'
      | 'status'
      | 'typeId'
    > = {
      answers: {},
      applicant: user.nationalId,
      assignees: [],
      attachments: {},
      state: initialState,
      status: ApplicationStatus.IN_PROGRESS,
      typeId: application.typeId,
    }

    const createdApplication = await this.applicationService.create(
      applicationDto,
    )

    // Make sure the application has the correct lifecycle values persisted to database.
    // Requires an application object that is created in the previous step.
    const {
      updatedApplication,
    } = await this.applicationService.updateApplicationState(
      createdApplication.id,
      createdApplication.state,
      createdApplication.answers as FormValue,
      createdApplication.assignees,
      createdApplication.status,
      getApplicationLifecycle(createdApplication as BaseApplication, template),
    )

    this.auditService.audit({
      auth: user,
      action: 'create',
      resources: updatedApplication.id,
      meta: { type: application.typeId },
    })

    const actionDto: BaseApplication = {
      ...applicationDto,
      id: createdApplication.id,
      modified: createdApplication.modified,
      created: createdApplication.created,
      answers: updatedApplication.answers as FormValue,
      externalData: updatedApplication.externalData as ExternalData,
      attachments: {},
    }

    // Trigger meta.onEntry for initial state on application creation
    const onEnterStateAction = new ApplicationTemplateHelper(
      actionDto,
      template,
    ).getOnEntryStateAPIAction(updatedApplication.state)

    if (onEnterStateAction) {
      const {
        updatedApplication: withUpdatedExternalData,
      } = await this.performActionOnApplication(
        actionDto,
        template,
        user,
        onEnterStateAction,
      )

      //Programmers responsible for handling failure status
      updatedApplication.externalData = withUpdatedExternalData.externalData
    }

    return updatedApplication
  }

  @Scopes(ApplicationScope.write)
  @Put('applications/assign')
  @ApiOkResponse({ type: ApplicationResponseDto })
  @UseInterceptors(ApplicationSerializer)
  @Audit<ApplicationResponseDto>({
    resources: (app) => app.id,
  })
  async assignApplication(
    @Body() assignApplicationDto: AssignApplicationDto,
    @CurrentUser() user: User,
  ): Promise<ApplicationResponseDto> {
    const decodedToken = verifyToken<DecodedAssignmentToken>(
      assignApplicationDto.token,
    )

    if (decodedToken === null) {
      throw new BadRequestException('Invalid token')
    }

    const existingApplication = await this.applicationService.findOneById(
      decodedToken.applicationId,
    )

    if (!existingApplication) {
      throw new NotFoundException(
        `An application with the id ${decodedToken.applicationId} does not exist`,
      )
    }

    // For convenience if the user attempting to be assigned is already an assignee
    // then return the application
    if (existingApplication.assignees.includes(user.nationalId)) {
      return existingApplication
    }

    if (decodedToken.nonce) {
      if (!existingApplication.assignNonces.includes(decodedToken.nonce)) {
        throw new NotFoundException('Token no longer usable.')
      }

      await this.applicationService.removeNonce(
        existingApplication,
        decodedToken.nonce,
      )
    } else if (new Date((decodedToken.iat + 3628800) * 1000) < new Date()) {
      //supporting legacy tokens but reducing the validity to 6 weeks from issue date
      throw new BadRequestException('Token has expired.')
    }

    if (existingApplication.state !== decodedToken.state) {
      throw new NotFoundException('Application no longer in assignable state')
    }

    const templateId = existingApplication.typeId as ApplicationTypes
    const template = await getApplicationTemplateByTypeId(templateId)

    // TODO
    if (template === null) {
      throw new BadRequestException(
        `No application template exists for type: ${existingApplication.typeId}`,
      )
    }

    await this.validationService.validateThatTemplateIsReady(user, template)

    const assignees = [user.nationalId]

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
      user,
    )

    if (hasError) {
      throw new BadRequestException(error)
    }

    if (hasChanged) {
      return updatedApplication
    }

    return existingApplication
  }

  @Scopes(ApplicationScope.write)
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() application: UpdateApplicationDto,
    @CurrentUser() user: User,
    @CurrentLocale() locale: Locale,
  ): Promise<ApplicationResponseDto> {
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user.nationalId,
    )
    const namespaces = await getApplicationTranslationNamespaces(
      existingApplication as BaseApplication,
    )
    const newAnswers = application.answers as FormValue
    const intl = await this.intlService.useIntl(namespaces, locale)

    await this.validationService.validateIncomingAnswers(
      existingApplication as BaseApplication,
      newAnswers,
      user.nationalId,
      true,
      intl.formatMessage,
    )

    await this.validationService.validateApplicationSchema(
      existingApplication,
      newAnswers,
      intl.formatMessage,
      user,
    )

    const mergedAnswers = mergeAnswers(existingApplication.answers, newAnswers)
    const { updatedApplication } = await this.applicationService.update(
      existingApplication.id,
      {
        answers: mergedAnswers,
      },
    )

    this.auditService.audit({
      auth: user,
      action: 'update',
      resources: updatedApplication.id,
      meta: { fields: Object.keys(newAnswers) },
    })
    return updatedApplication
  }

  @Scopes(ApplicationScope.write)
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() externalDataDto: PopulateExternalDataDto,
    @CurrentUser() user: User,
    @CurrentLocale() locale: Locale,
  ): Promise<ApplicationResponseDto> {
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user.nationalId,
    )

    await this.validationService.validateIncomingExternalDataProviders(
      existingApplication as BaseApplication,
      externalDataDto,
      user.nationalId,
    )

    const templateId = existingApplication.typeId as ApplicationTypes
    const template = await getApplicationTemplateByTypeId(templateId)

    const helper = new ApplicationTemplateHelper(
      existingApplication as BaseApplication,
      template,
    )

    const userRole = template.mapUserToRole(
      user.nationalId,
      existingApplication as BaseApplication,
    )

    const providersFromRole = userRole
      ? helper.getDataProvidersFromRoleInState(userRole)
      : []

    const listOfProviders: ApplicationTemplateAPIAction[] = []

    for (let i = 0; i < externalDataDto.dataProviders.length; i++) {
      const found = providersFromRole.find(
        (x) => x.externalDataId === externalDataDto.dataProviders[i].id,
      )

      if (found) {
        listOfProviders.push({
          ...found,
          order: externalDataDto.dataProviders[i].order,
        })
      } else {
        throw new BadRequestException(
          'Data provider not found with id ' +
            externalDataDto.dataProviders[i].id,
        )
      }
    }

    const updatedApplication = await this.templateApiActionRunner.run(
      existingApplication as BaseApplication,
      listOfProviders,
      user,
    )

    if (!updatedApplication) {
      throw new NotFoundException(
        `An application with the id ${id} does not exist`,
      )
    }

    this.auditService.audit({
      auth: user,
      action: 'updateExternalData',
      resources: existingApplication.id,
      meta: { providers: externalDataDto },
    })

    return updatedApplication
  }

  @Scopes(ApplicationScope.write)
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateApplicationStateDto: UpdateApplicationStateDto,
    @CurrentUser() user: User,
    @CurrentLocale() locale: Locale,
  ): Promise<ApplicationResponseDto> {
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user.nationalId,
    )
    const templateId = existingApplication.typeId as ApplicationTypes
    const template = await getApplicationTemplateByTypeId(templateId)

    // TODO
    if (template === null) {
      throw new BadRequestException(
        `No application template exists for type: ${existingApplication.typeId}`,
      )
    }

    const newAnswers = (updateApplicationStateDto.answers ?? {}) as FormValue
    const namespaces = await getApplicationTranslationNamespaces(
      existingApplication as BaseApplication,
    )
    const intl = await this.intlService.useIntl(namespaces, locale)

    const permittedAnswers = await this.validationService.validateIncomingAnswers(
      existingApplication as BaseApplication,
      newAnswers,
      user.nationalId,
      false,
      intl.formatMessage,
    )

    await this.validationService.validateApplicationSchema(
      existingApplication as BaseApplication,
      permittedAnswers,
      intl.formatMessage,
      user,
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
      user,
    )

    this.auditService.audit({
      auth: user,
      action: 'submitApplication',
      resources: existingApplication.id,
      meta: {
        event: updateApplicationStateDto.event,
        before: existingApplication.state,
        after: updatedApplication.state,
        fields: Object.keys(permittedAnswers),
      },
    })

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
    auth: User,
    action: ApplicationTemplateAPIAction,
  ): Promise<TemplateAPIModuleActionResult> {
    const {
      apiModuleAction,
      shouldPersistToExternalData,
      externalDataId,
      throwOnError,
    } = action
    console.log('performActionOnApplication', action)

    //TODO provide a way to call multiple at once without concurrency issues
    const actionResult = await this.templateAPIService.performAction({
      templateId: template.type,
      type: apiModuleAction,
      props: {
        application,
        auth,
      },
    })

    let updatedApplication: BaseApplication = application

    if (shouldPersistToExternalData) {
      const newExternalDataEntry: ExternalData = {
        [externalDataId || apiModuleAction]: {
          status: actionResult.success ? 'success' : 'failure',
          date: new Date(),
          data: actionResult.success
            ? (actionResult.response as ExternalData['data'])
            : actionResult.error,
        },
      }

      const {
        updatedApplication: withExternalData,
      } = await this.applicationService.updateExternalData(
        updatedApplication.id,
        updatedApplication.externalData,
        newExternalDataEntry,
      )

      updatedApplication = {
        ...updatedApplication,
        externalData: {
          ...updatedApplication.externalData,
          ...withExternalData.externalData,
        },
      }
    }

    if (!actionResult.success && throwOnError) {
      return {
        updatedApplication,
        hasError: true,
        error: actionResult.error,
      }
    }

    return {
      updatedApplication,
      hasError: false,
    }
  }

  private async changeState(
    application: BaseApplication,
    template: Unwrap<typeof getApplicationTemplateByTypeId>,
    event: string,
    auth: User,
  ): Promise<StateChangeResult> {
    const helper = new ApplicationTemplateHelper(application, template)
    const onExitStateAction = helper.getOnExitStateAPIAction(application.state)
    const status = helper.getApplicationStatus()
    let updatedApplication: BaseApplication = application
    await this.applicationService.clearNonces(updatedApplication.id)
    if (onExitStateAction) {
      const {
        hasError,
        error,
        updatedApplication: withUpdatedExternalData,
      } = await this.performActionOnApplication(
        updatedApplication,
        template,
        auth,
        onExitStateAction,
      )
      updatedApplication = withUpdatedExternalData

      if (hasError) {
        return {
          hasChanged: false,
          application: updatedApplication,
          error,
          hasError: true,
        }
      }
    }

    const [
      hasChanged,
      newState,
      withUpdatedState,
    ] = new ApplicationTemplateHelper(updatedApplication, template).changeState(
      event,
    )
    updatedApplication = {
      ...updatedApplication,
      answers: withUpdatedState.answers,
      assignees: withUpdatedState.assignees,
      state: withUpdatedState.state,
    }

    if (!hasChanged) {
      return {
        hasChanged: false,
        hasError: false,
        application: updatedApplication,
      }
    }

    const onEnterStateAction = new ApplicationTemplateHelper(
      updatedApplication,
      template,
    ).getOnEntryStateAPIAction(newState)

    if (onEnterStateAction) {
      const {
        hasError,
        error,
        updatedApplication: withUpdatedExternalData,
      } = await this.performActionOnApplication(
        updatedApplication,
        template,
        auth,
        onEnterStateAction,
      )
      updatedApplication = withUpdatedExternalData

      if (hasError) {
        return {
          hasError: true,
          hasChanged: false,
          error,
          application,
        }
      }
    }

    try {
      const update = await this.applicationService.updateApplicationState(
        application.id,
        newState,
        updatedApplication.answers,
        updatedApplication.assignees,
        status,
        getApplicationLifecycle(updatedApplication, template),
      )

      updatedApplication = update.updatedApplication as BaseApplication
    } catch (e) {
      return {
        hasChanged: false,
        hasError: true,
        application,
        error: 'Could not update application',
      }
    }

    return {
      hasChanged: true,
      application: updatedApplication,
      hasError: false,
    }
  }

  @Scopes(ApplicationScope.write)
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: AddAttachmentDto,
    @CurrentUser() user: User,
  ): Promise<ApplicationResponseDto> {
    const { key, url } = input

    const {
      updatedApplication,
    } = await this.applicationService.updateAttachment(
      id,
      user.nationalId,
      key,
      url,
    )

    await this.uploadQueue.add('upload', {
      applicationId: updatedApplication.id,
      nationalId: user.nationalId,
      attachmentUrl: url,
    })

    this.auditService.audit({
      auth: user,
      action: 'addAttachment',
      resources: updatedApplication.id,
      meta: {
        file: key,
      },
    })

    return updatedApplication
  }

  @Scopes(ApplicationScope.write)
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: DeleteAttachmentDto,
    @CurrentUser() user: User,
  ): Promise<ApplicationResponseDto> {
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user.nationalId,
    )
    const { key } = input

    const { updatedApplication } = await this.applicationService.update(
      existingApplication.id,
      {
        attachments: omit(existingApplication.attachments, key),
      },
    )

    this.auditService.audit({
      auth: user,
      action: 'deleteAttachment',
      resources: updatedApplication.id,
      meta: {
        file: key,
      },
    })

    return updatedApplication
  }

  @Scopes(ApplicationScope.write)
  @Put('applications/:id/generatePdf')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to create a pdf for',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: PresignedUrlResponseDto })
  async generatePdf(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: GeneratePdfDto,
    @CurrentUser() user: User,
  ): Promise<PresignedUrlResponseDto> {
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user.nationalId,
    )
    const url = await this.fileService.generatePdf(
      existingApplication,
      input.type,
    )

    this.auditService.audit({
      auth: user,
      action: 'generatePdf',
      resources: existingApplication.id,
      meta: { type: input.type },
    })

    return { url }
  }

  @Scopes(ApplicationScope.write)
  @Put('applications/:id/requestFileSignature')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description:
      'The id of the application which the file signature is requested for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: RequestFileSignatureResponseDto })
  async requestFileSignature(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: RequestFileSignatureDto,
    @CurrentUser() user: User,
  ): Promise<RequestFileSignatureResponseDto> {
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user.nationalId,
    )
    const {
      controlCode,
      documentToken,
    } = await this.fileService.requestFileSignature(
      existingApplication,
      input.type,
    )

    this.auditService.audit({
      auth: user,
      action: 'requestFileSignature',
      resources: existingApplication.id,
      meta: { type: input.type },
    })

    return { controlCode, documentToken }
  }

  @Scopes(ApplicationScope.write)
  @Put('applications/:id/uploadSignedFile')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application which the file was created for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: UploadSignedFileResponseDto })
  async uploadSignedFile(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: UploadSignedFileDto,
    @CurrentUser() user: User,
  ): Promise<UploadSignedFileResponseDto> {
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user.nationalId,
    )

    await this.fileService.uploadSignedFile(
      existingApplication,
      input.documentToken,
      input.type,
    )

    this.auditService.audit({
      auth: user,
      action: 'uploadSignedFile',
      resources: existingApplication.id,
      meta: { type: input.type },
    })

    return {
      documentSigned: true,
    }
  }

  @Scopes(ApplicationScope.read)
  @Get('applications/:id/:pdfType/presignedUrl')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application which the file was created for.',
    allowEmptyValue: false,
  })
  @ApiOkResponse({ type: PresignedUrlResponseDto })
  async getPresignedUrl(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('pdfType') type: PdfTypes,
    @CurrentUser() user: User,
  ): Promise<PresignedUrlResponseDto> {
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user.nationalId,
    )
    const url = await this.fileService.getPresignedUrl(
      existingApplication,
      type,
    )

    this.auditService.audit({
      auth: user,
      action: 'getPresignedUrl',
      resources: existingApplication.id,
      meta: { type },
    })

    return { url }
  }

  @Get('applications/:id/attachments/:attachmentKey/presigned-url')
  @Scopes(ApplicationScope.read)
  @Documentation({
    description: 'Gets a presigned url for attachments',
    response: { status: 200, type: PresignedUrlResponseDto },
    request: {
      query: {},
      params: {
        id: {
          type: 'string',
          description: 'application id',
          required: true,
        },
        attachmentKey: {
          type: 'string',
          description: 'key for attachment',
          required: true,
        },
      },
    },
  })
  async getAttachmentPresignedURL(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('attachmentKey') attachmentKey: string,
    @CurrentUser() user: User,
  ): Promise<PresignedUrlResponseDto> {
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      user.nationalId,
    )

    if (!existingApplication.attachments) {
      throw new NotFoundException('Attachments not found')
    }

    try {
      const str = attachmentKey as keyof typeof existingApplication.attachments
      const fileName = existingApplication.attachments[str]
      return await this.fileService.getAttachmentPresignedURL(fileName)
    } catch (error) {
      throw new NotFoundException('Attachment not found')
    }
  }

  @Scopes(ApplicationScope.write)
  @Delete('applications/:id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the application to delete.',
    allowEmptyValue: false,
  })
  async delete(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: User,
  ) {
    const { nationalId } = user
    const existingApplication = (await this.applicationAccessService.findOneByIdAndNationalId(
      id,
      nationalId,
    )) as BaseApplication
    const canDelete = await this.applicationAccessService.canDeleteApplication(
      existingApplication,
      nationalId,
    )

    if (!canDelete) {
      throw new ForbiddenException(
        'Users role does not have permission to delete this application in this state',
      )
    }
    await this.applicationService.delete(existingApplication.id)
  }
}

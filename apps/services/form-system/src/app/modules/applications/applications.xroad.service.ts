import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Application } from './models/application.model'
import { ApplicationMapper } from './models/application.mapper'
import { ApplicationsService } from './applications.service'
import { FileResponseDto } from './models/dto/file.response.dto'
import {
  ApplicationXroadDto,
  ApplicationXroadFieldDto,
  ApplicationXroadValueDto,
} from './models/dto/application.xroad.dto'
import { ApplicationDto } from './models/dto/application.dto'
import { FieldTypesEnum } from '@island.is/form-system/shared'
import { FileService } from '../file/file.service'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'

@Injectable()
export class ApplicationsXRoadService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @InjectModel(Application)
    private readonly applicationModel: typeof Application,
    private readonly applicationMapper: ApplicationMapper,
    private readonly applicationsService: ApplicationsService,
    private readonly fileService: FileService,
  ) {}

  async getApplication(
    id: string,
    xRoadClient: string,
  ): Promise<ApplicationXroadDto> {
    const application = await this.applicationModel.findByPk(id)

    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`)
    }

    const form = await this.applicationsService.getApplicationForm(
      application.formId,
      id,
      application.formSlug ?? '',
    )

    if (!form) {
      throw new NotFoundException(`Form for application id ${id} not found`)
    }

    const memberCode = this.getXroadMemberCode(xRoadClient)
    const formOwner = form.organizationNationalId

    if (memberCode !== formOwner) {
      this.logger.warn(
        `X-Road client with member code ${memberCode} attempted to access application ${id} owned by ${formOwner}`,
      )
      throw new UnauthorizedException(
        `You do not have access to this application.`,
      )
    }

    const applicationDto = this.applicationMapper.mapFormToApplicationDto(
      form,
      application,
    )

    return this.mapApplicationDtoToApplicationXroadDto(applicationDto)
  }

  private mapApplicationDtoToApplicationXroadDto(
    applicationDto: ApplicationDto,
  ): ApplicationXroadDto {
    const fields: ApplicationXroadFieldDto[] = (applicationDto.sections ?? [])
      .flatMap((section) => section.screens ?? [])
      .flatMap((screen) => screen.fields ?? [])
      .filter((field) => !field.isHidden)
      .filter((field) => field.fieldType !== FieldTypesEnum.MESSAGE)
      .filter((field) => (field.values?.length ?? 0) > 0)
      .map((field) => {
        const xroadField = new ApplicationXroadFieldDto()
        xroadField.identifier = field.identifier
        xroadField.screenId = field.screenId
        xroadField.fieldType = field.fieldType
        xroadField.values = (field.values ?? []).map((value) => {
          const xroadValue = new ApplicationXroadValueDto()
          xroadValue.order = value.order
          xroadValue.json = (value.json ?? {}) as Record<string, unknown>
          return xroadValue
        })
        return xroadField
      })

    const xroadDto = new ApplicationXroadDto()
    xroadDto.id = applicationDto.id ?? ''
    xroadDto.formId = applicationDto.formId ?? ''
    xroadDto.isTest = applicationDto.isTest ?? false
    xroadDto.status = applicationDto.status ?? ''
    xroadDto.submittedAt = applicationDto.submittedAt ?? null
    xroadDto.fields = fields

    return xroadDto
  }

  async getFile(id: string, xRoadClient: string): Promise<FileResponseDto> {
    const applicationId = id.split('/')[0]
    const application = await this.applicationModel.findByPk(applicationId)

    if (!application) {
      throw new NotFoundException(
        `Application with id ${applicationId} not found`,
      )
    }

    const form = await this.applicationsService.getApplicationForm(
      application.formId,
      applicationId,
      application.formSlug ?? '',
    )

    if (!form) {
      throw new NotFoundException(
        `Form for application id ${applicationId} not found`,
      )
    }

    const memberCode = this.getXroadMemberCode(xRoadClient)
    const formOwner = form.organizationNationalId

    if (memberCode !== formOwner) {
      this.logger.warn(
        `X-Road client with member code ${memberCode} attempted to access application ${applicationId} owned by ${formOwner}`,
      )
      throw new UnauthorizedException(
        `You do not have access to this application.`,
      )
    }

    const fileContent = await this.fileService.getFile(id)
    if (fileContent == null) {
      throw new NotFoundException(`File with id ${id} not found`)
    }

    const file = new FileResponseDto()
    file.id = id
    file.file = fileContent
    file.filename = this.displayNameFromS3Key(id)
    file.fileType = this.fileTypeFromS3Key(id)
    file.size = Buffer.byteLength(fileContent, 'base64')
    return file
  }

  private displayNameFromS3Key = (key: string): string => {
    const lastPart = key.split('/').pop() ?? key
    const underscoreIndex = lastPart.indexOf('_')
    const fileName =
      underscoreIndex >= 0 ? lastPart.slice(underscoreIndex + 1) : lastPart

    return fileName
  }

  private fileTypeFromS3Key = (key: string): string => {
    const parts = key.split('.')
    if (parts.length < 2) return 'unknown' // no extension

    return (parts.pop() ?? '').toLowerCase()
  }

  private getXroadMemberCode(xRoadClient: string): string {
    const parts = (xRoadClient ?? '').trim().split('/').filter(Boolean)
    if (parts.length < 4) return 'invalid-client-id'
    return parts[2] ?? 'invalid-client-id'
  }
}

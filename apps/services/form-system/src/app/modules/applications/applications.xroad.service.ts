import {
  BadRequestException,
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
import { ApplicationXroadDto } from './models/dto/application.xroad.dto'
import { FileService } from '../file/file.service'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { ApplicationEvent } from './models/applicationEvent.model'
import { ApplicationEvents } from '@island.is/form-system/shared'

@Injectable()
export class ApplicationsXRoadService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @InjectModel(Application)
    private readonly applicationModel: typeof Application,
    @InjectModel(ApplicationEvent)
    private readonly applicationEventModel: typeof ApplicationEvent,
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

    if (application.pruned) {
      throw new NotFoundException(
        `Application with id ${id} is pruned and cannot be accessed`,
      )
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
        `This application is owned by a different organization.`,
      )
    }

    const applicationDto = this.applicationMapper.mapFormToApplicationDto(
      form,
      application,
    )

    const applicationXroadDto =
      this.applicationMapper.mapApplicationDtoToApplicationXroadDto(
        applicationDto,
      )

    try {
      await this.applicationEventModel.create({
        applicationId: id,
        eventType: ApplicationEvents.APPLICATION_FETCHED,
        eventMessage: {
          is: 'Umsókn sótt',
          en: 'Application fetched',
        },
      } as ApplicationEvent)
    } catch (err) {
      this.logger.error(
        `Failed to persist APPLICATION_FETCHED event for application ${id}`,
        err,
      )
    }

    return applicationXroadDto
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
        `This application-file is owned by a different organization.`,
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
    if (parts.length < 4 || !parts[2]) {
      throw new BadRequestException('Invalid X-Road-Client header format')
    }
    return parts[2]
  }
}

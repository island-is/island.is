import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService, sharedModuleConfig } from '../../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { VmstUnemploymentClientService } from '@island.is/clients/vmst-unemployment'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../../types'
import type { Logger } from '@island.is/logging'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'
import { TemplateApiError } from '@island.is/nest/problem'
import { FetchError } from '@island.is/clients/middlewares'
import { S3Service } from '@island.is/nest/aws'
import { ConfigType } from '@nestjs/config'
import { errorMessages } from '@island.is/application/templates/vmst/submit-documents'

interface DocumentEntry {
  type: string
  file: Array<{ key: string; name: string }>
  comment: string
}

interface CreatedAttachment {
  attachmentId: string
  attachmentTypeId: string
}

const getMimeType = (fileName: string): string | undefined => {
  const parts = fileName.trim().split('.')
  if (parts.length < 2) return undefined
  const ext = parts.pop()?.toLowerCase()
  switch (ext) {
    case 'pdf':
      return 'application/pdf'
    case 'png':
      return 'image/png'
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'heic':
      return 'image/heic'
    case 'doc':
      return 'application/msword'
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    case 'rtf':
      return 'application/rtf'
    default:
      return undefined
  }
}

@Injectable()
export class SubmitDocumentsService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
    private readonly vmstUnemploymentClientService: VmstUnemploymentClientService,
    private readonly s3Service: S3Service,
    @Inject(sharedModuleConfig.KEY)
    private config: ConfigType<typeof sharedModuleConfig>,
  ) {
    super(ApplicationTypes.VMST_SUBMIT_DOCUMENTS)
  }

  async checkEligibility({
    auth,
    currentUserLocale,
  }: TemplateApiModuleActionProps) {
    let result
    try {
      result =
        await this.vmstUnemploymentClientService.checkCreateAttachmentEligibility(
          auth,
        )
    } catch (e) {
      if (e instanceof FetchError && e.status === 404) {
        this.logger.warn(
          '[VMST-Submit-Documents] - No active application found (404)',
        )
        throw new TemplateApiError(
          {
            title: errorMessages.eligibilityErrorTitle,
            summary: errorMessages.cannotApplyErrorSummary,
          },
          404,
        )
      }

      this.logger.error(
        '[VMST-Submit-Documents] - Error checking eligibility',
        e,
      )
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.failedDataProvider,
        },
        500,
      )
    }

    if (!result.isEligible) {
      throw new TemplateApiError(
        {
          title: errorMessages.eligibilityErrorTitle,
          summary:
            (currentUserLocale === 'is' ? result.reason : result.reasonEN) ||
            errorMessages.cannotApplyErrorSummary,
        },
        400,
      )
    }

    return {
      ...result,
      applicantId: result.applicantId,
    }
  }

  async getAttachmentTypes(_props: TemplateApiModuleActionProps) {
    let response
    try {
      response = await this.vmstUnemploymentClientService.getAttachmentTypes()
    } catch (e) {
      this.logger.error(
        '[VMST-Submit-Documents] - Error fetching attachment types',
        e,
      )
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.failedDataProvider,
        },
        500,
      )
    }

    if (!response.success) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: response.errorMessage ?? '',
        },
        400,
      )
    }

    return response.attachmentTypes?.filter(
      (type) => type.visibleInApplicationDataRequest === true,
    )
  }

  async completeApplication({
    application,
  }: TemplateApiModuleActionProps): Promise<CreatedAttachment[]> {
    const documents = getValueViaPath<DocumentEntry[]>(
      application.answers,
      'documents',
    )

    if (!documents || documents.length === 0) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.errorDataProvider,
        },
        400,
      )
    }

    // Flatten all files with their parent document type for processing
    const fileEntries = documents.flatMap((document) =>
      document.file.map((file) => ({
        file,
        attachmentTypeId: document.type,
      })),
    )

    // Phase 1: Fetch all file contents from S3 in parallel
    const fileContents = await Promise.all(
      fileEntries.map(async ({ file }) => {
        const s3Url = (application.attachments as Record<string, string>)?.[
          file.key
        ]

        if (!s3Url) {
          this.logger.error(
            `[VMST-Submit-Documents] - Missing S3 URL for file key: ${file.key}`,
          )
          throw new TemplateApiError(
            {
              title: coreErrorMessages.defaultTemplateApiError,
              summary: coreErrorMessages.errorDataProvider,
            },
            500,
          )
        }

        const content = await this.s3Service.getFileContent(s3Url, 'base64')

        if (!content) {
          this.logger.error(
            `[VMST-Submit-Documents] - Failed to fetch file content from S3 for: ${file.name}`,
          )
          throw new TemplateApiError(
            {
              title: coreErrorMessages.defaultTemplateApiError,
              summary: coreErrorMessages.errorDataProvider,
            },
            500,
          )
        }

        return { content, fileName: file.name }
      }),
    )

    // Phase 2: Create attachments in parallel in Galdur
    let createdAttachments: CreatedAttachment[]

    try {
      createdAttachments = await Promise.all(
        fileEntries.map(async ({ attachmentTypeId }, i) => {
          const { content, fileName } = fileContents[i]
          const mimeType = getMimeType(fileName)

          const response =
            await this.vmstUnemploymentClientService.createAttachmentForApplication(
              {
                galdurDomainModelsAttachmentsCreateAttachmentRequest: {
                  attachmentTypeId,
                  fileName,
                  fileType: mimeType,
                  data: content,
                },
              },
            )

          if (!response.success) {
            this.logger.error(
              `[VMST-Submit-Documents] - Failed to create attachment: ${response.errorMessage}`,
            )
            throw new TemplateApiError(
              {
                title: coreErrorMessages.defaultTemplateApiError,
                summary: response.errorMessage ?? '',
              },
              400,
            )
          }

          if (!response.attachment?.id) {
            this.logger.error(
              '[VMST-Submit-Documents] - Attachment created but no ID returned',
            )
            throw new TemplateApiError(
              {
                title: coreErrorMessages.defaultTemplateApiError,
                summary: coreErrorMessages.errorDataProvider,
              },
              500,
            )
          }

          return {
            attachmentId: response.attachment.id,
            attachmentTypeId,
          }
        }),
      )
    } catch (e) {
      if (e instanceof TemplateApiError) {
        throw e
      }

      this.logger.error(
        '[VMST-Submit-Documents] - Unexpected error creating attachments',
        e,
      )
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: coreErrorMessages.failedDataProvider,
        },
        500,
      )
    }

    // Phase 3: Link created attachments to the applicant
    const applicantId =
      getValueViaPath<string>(
        application.externalData,
        'submitDocumentsEligibility.data.applicantId',
      ) || ''

    const linkResponse =
      await this.vmstUnemploymentClientService.createApplicantRequestedAttachments(
        {
          applicantId,
          galdurExternalDomainRequestsApplicantSubmitAttachmentRequestRequest:
            createdAttachments.map((a) => ({
              attachmentId: a.attachmentId,
            })),
        },
      )

    if (!linkResponse.success) {
      this.logger.error(
        `[VMST-Submit-Documents] - Failed to link attachments to applicant: ${linkResponse.errorMessage}`,
      )
      throw new TemplateApiError(
        {
          title: coreErrorMessages.defaultTemplateApiError,
          summary: linkResponse.errorMessage ?? '',
        },
        400,
      )
    }

    return createdAttachments
  }
}

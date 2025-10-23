import { Inject, Injectable } from '@nestjs/common'
import {
  ApplicationTypes,
  NotificationType,
} from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { NotificationsService } from '../../../../notification/notifications.service'
import { TemplateApiModuleActionProps } from '../../../../types'
import { Fasteign, FasteignirApi } from '@island.is/clients/assets'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { mockGetProperties } from './mockedFasteign'
import { LOGGER_PROVIDER, withLoggingContext } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  coreErrorMessages,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import {
  getApplicant,
  mapAnswersToApplicationDto,
  mapAnswersToApplicationFilesContentDto,
  paymentForAppraisal,
} from './utils'
import { ApplicationApi } from '@island.is/clients/hms-application-system'
import { TemplateApiError } from '@island.is/nest/problem'
import { AttachmentS3Service } from '../../../shared/services'

@Injectable()
export class FireCompensationAppraisalService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private propertiesApi: FasteignirApi,
    private hmsApplicationSystemService: ApplicationApi,
    private readonly attachmentService: AttachmentS3Service,
    private readonly notificationsService: NotificationsService,
  ) {
    super(ApplicationTypes.FIRE_COMPENSATION_APPRAISAL)
  }

  private getRealEstatesWithAuth(auth: User) {
    return this.propertiesApi.withMiddleware(
      new AuthMiddleware(auth, { forwardUserInfo: true }),
    )
  }

  async getProperties({ auth, application }: TemplateApiModuleActionProps) {
    let properties: Array<Fasteign> = []
    const otherPropertiesThanIOwn = getValueViaPath<string[]>(
      application.answers,
      'otherPropertiesThanIOwnCheckbox',
    )?.includes(YES)

    // Mock for dev, since there is no dev service for the propertiesApi
    if (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) {
      properties = mockGetProperties()
    }
    // If on prod we fetch a list of all the fasteignanúmer for kennitala and then
    // fetch each property individually with the full data.
    else {
      try {
        const api = this.getRealEstatesWithAuth(auth)
        const simpleProperties = await api.fasteignirGetFasteignir({
          kennitala: auth.nationalId,
        })

        properties = await Promise.all(
          simpleProperties?.fasteignir?.map((property) => {
            return api.fasteignirGetFasteign({
              fasteignanumer:
                // fasteignirGetFasteignir returns the fasteignanumer with and "F" in front
                // but fasteignirGetFasteign throws an error if the fasteignanumer is not only numbers
                property.fasteignanumer?.replace(/\D/g, '') ?? '',
            })
          }) ?? [],
        )
      } catch (e) {
        this.logger.error('Failed to fetch properties:', e.message)
        throw new TemplateApiError(e, 500)
      }
    }

    if (properties?.length === 0 && !otherPropertiesThanIOwn) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.noPropertiesFoundTitle,
          summary: coreErrorMessages.noPropertiesFoundSummary,
        },
        400,
      )
    }

    return properties
  }

  async calculateAmount(props: TemplateApiModuleActionProps) {
    const { application } = props

    try {
      const otherPropertiesThanIOwn = getValueViaPath<string[]>(
        application.answers,
        'otherPropertiesThanIOwnCheckbox',
      )?.includes(YES)

      const selectedRealEstateId = otherPropertiesThanIOwn
        ? 'F' +
          getValueViaPath<string>(application.answers, 'selectedPropertyByCode')
        : getValueViaPath<string>(application.answers, 'realEstate')

      if (!selectedRealEstateId) {
        throw new TemplateApiError('Selected real estate id is not set', 500)
      }

      const selectedUsageUnits = getValueViaPath<Array<string>>(
        application.answers,
        'usageUnits',
      )

      const properties = otherPropertiesThanIOwn
        ? getValueViaPath<Array<Fasteign>>(application.answers, 'anyProperties')
        : await this.getProperties(props)

      if (!properties) {
        throw new TemplateApiError('Properties is undefined', 500)
      }

      const property = properties.find(
        (property) => property.fasteignanumer === selectedRealEstateId,
      )

      const usageUnitsFireAppraisal =
        property?.notkunareiningar?.notkunareiningar?.map((unit) => {
          if (selectedUsageUnits?.includes(unit.notkunareininganumer ?? '')) {
            return unit.brunabotamat
          }
          return 0
        })

      const selectedUnitsFireAppraisal =
        usageUnitsFireAppraisal?.reduce((acc, curr) => {
          return (acc ?? 0) + (curr ?? 0)
        }, 0) ?? 0
      return paymentForAppraisal(selectedUnitsFireAppraisal)
    } catch (e) {
      this.logger.error('Failed to calculate amount:', e.message)
      throw new TemplateApiError(
        'Error came up calculating the current fire compensation appraisal',
        500,
      )
    }
  }

  async sendNotificationToAllInvolved({
    application,
  }: TemplateApiModuleActionProps): Promise<void> {
    try {
      const otherPropertiesThanIOwn = getValueViaPath<string[]>(
        application.answers,
        'otherPropertiesThanIOwnCheckbox',
      )?.includes(YES)

      const selectedRealEstateId = otherPropertiesThanIOwn
        ? 'F' +
          getValueViaPath<string>(application.answers, 'selectedPropertyByCode')
        : getValueViaPath<string>(application.answers, 'realEstate')

      if (!selectedRealEstateId) {
        throw new TemplateApiError('Selected real estate id is not set', 500)
      }

      const realEstates = otherPropertiesThanIOwn
        ? getValueViaPath<Array<Fasteign>>(application.answers, 'anyProperties')
        : getValueViaPath<Array<Fasteign>>(
            application.externalData,
            'getProperties.data',
          )

      const selectedRealEstate = realEstates?.find(
        (realEstate) => realEstate.fasteignanumer === selectedRealEstateId,
      )

      if (!selectedRealEstate) {
        throw new TemplateApiError('Selected real estate is not set', 500)
      }

      const applicant = getApplicant(application.answers)
      const { nationalId: applicantNationalId, name: applicantName } = applicant

      if (!applicantNationalId || !applicantName) {
        throw new TemplateApiError('Applicant is not set', 500)
      }

      const owners =
        selectedRealEstate?.thinglystirEigendur?.thinglystirEigendur ?? []
      const address =
        selectedRealEstate?.sjalfgefidStadfang?.birtingStutt?.toString()
      const postalCode =
        selectedRealEstate?.sjalfgefidStadfang?.postnumer?.toString()

      if (!address || !postalCode) {
        throw new TemplateApiError('Address or postal code is not set', 500)
      }

      const fullAddress = address + ', ' + postalCode

      // Filter out companies and organizations since we dont send them notifications
      const ownersSsn = owners
        .map((o) => o.kennitala)
        .filter((ssn): ssn is string => typeof ssn === 'string' && ssn !== '')

      // deduplicate and filter
      const recipients = Array.from(
        new Set<string>([applicantNationalId, ...ownersSsn]),
      ).filter((id) => typeof id === 'string' && id !== '')

      const results = await Promise.allSettled(
        recipients.map((recipientNationalId) =>
          this.notificationsService.sendNotification({
            type: NotificationType.FireCompensationAppraisal,
            messageParties: {
              recipient: recipientNationalId,
              sender: applicantNationalId,
            },
            applicationId: application.id,
            args: {
              applicantName:
                recipientNationalId === applicantNationalId
                  ? 'þú'
                  : applicantName,
              applicationId: application.id,
              appliedForAddress: fullAddress,
              realEstateId: selectedRealEstateId,
            },
          }),
        ),
      )

      const failed = results
        .map((result, i) => ({ result, recipient: recipients[i] }))
        .filter(
          (x): x is { result: PromiseRejectedResult; recipient: string } =>
            x.result.status === 'rejected',
        )

      if (failed.length > 0) {
        const details = failed
          .map(
            (failedResult) =>
              `${failedResult.recipient}: ${
                (failedResult.result.reason as Error)?.message ??
                String(failedResult.result.reason)
              }`,
          )
          .join('; ')

        withLoggingContext({ applicationId: application.id }, () => {
          this.logger.error(
            `Failed to send notification to ${failed.length} recipient(s): ${details}`,
          )
        })
      }
    } catch (e) {
      this.logger.error(
        'Failed to send notification to all involved:',
        e.message,
      )
      // Dont throw error since this happens when the application has already been sent
    }
  }

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    try {
      // get content of files from S3
      const files = await this.attachmentService.getFiles(application, [
        'photos',
      ])

      const missingFiles = files.filter(
        (file) => !file.fileContent || file.fileContent.trim().length === 0,
      )

      if (missingFiles.length > 0) {
        this.logger.error('Missing file content for attachments', {
          missingKeys: missingFiles.map((file) => file.key),
        })
        throw new TemplateApiError(
          'Failed to submit application, missing file content',
          500,
        )
      }

      // Map the application to the dto interface
      const applicationDto = mapAnswersToApplicationDto(application, files)

      // Send the application to HMS
      const res = await this.hmsApplicationSystemService.apiApplicationPost({
        applicationDto,
      })

      if (res.status !== 200) {
        throw new TemplateApiError(
          'Failed to submit application, non 200 status',
          500,
        )
      }
      // Map the photos to the dto interface
      const applicationFilesContentDtoArray =
        mapAnswersToApplicationFilesContentDto(application, files)

      // Send the photos in to HMS
      const photoResults = await Promise.all(
        applicationFilesContentDtoArray.map(
          async (applicationFilesContentDto) => {
            return await this.hmsApplicationSystemService.apiApplicationUploadPost(
              {
                applicationFilesContentDto,
              },
            )
          },
        ),
      )

      if (photoResults.some((result) => result.status !== 200)) {
        throw new TemplateApiError(
          'Failed to upload photos, non 200 status',
          500,
        )
      }

      return res
    } catch (e) {
      this.logger.error('Failed to submit application:', e.message)
      throw new TemplateApiError(e, 500)
    }
  }
}

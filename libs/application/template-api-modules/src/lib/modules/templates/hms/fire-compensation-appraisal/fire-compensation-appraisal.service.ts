import { Inject, Injectable } from '@nestjs/common'
import {
  ApplicationTypes,
  NotificationType,
} from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { NotificationsService } from '../../../../notification/notifications.service'
import { TemplateApiModuleActionProps } from '../../../../types'
import {
  Fasteign,
  FasteignirApi,
  FasteignSimpleWrapper,
} from '@island.is/clients/assets'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { getMockedFasteign, mockGetProperties } from './mockedFasteign'
import { LOGGER_PROVIDER, withLoggingContext } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  coreErrorMessages,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import {
  getApplicant,
  getSelectedRealEstate,
  mapAnswersToApplicationDto,
  mapAnswersToApplicationDtoSdf,
  mapAnswersToSingleApplicationFilesContentDto,
  paymentForAppraisal,
  sumSelectedUnitsFireCompensation,
} from './utils'
import { ApplicationApi } from '@island.is/clients/hms-application-system'
import { TemplateApiError } from '@island.is/nest/problem'
import { AttachmentS3Service } from '../../../shared/services'
import { FetchError } from '@island.is/clients/middlewares'
import { HmsService } from '@island.is/clients/hms'

// NOTE: These error messages intentionally duplicate
// `prereqMessages.getPropertiesError{Title,Summary}` from the frontend template
// lib (`@island.is/application/templates/hms/fire-compensation-appraisal`).
// Importing that barrel into this backend service pulls in the whole template
// (FormBuilder/React/vanilla-extract) and creates a circular import that strips
// this service's `design:paramtypes` metadata at decoration time — leaving every
// type-injected dependency (the API clients, NotificationsService, …) undefined
// at runtime. Keep backend services free of frontend-template-barrel imports.
const getPropertiesErrorMessages = {
  title: {
    id: 'fca.application:prereq.getPropertiesErrorTitle',
    defaultMessage: 'Ekki tókst að sækja upplýsingar um fasteignir',
    description: 'Error title for getting properties',
  },
  summary: {
    id: 'fca.application:prereq.getPropertiesErrorSummary#markdown',
    defaultMessage:
      'Vinsamlega hafið samband við HMS í [hms@hms.is](mailto:hms@hms.is)',
    description: 'Error summary for getting properties',
  },
}

type SearchAnswer = {
  query?: string
  value?: string
  label?: string
}

const cleanupSearch = (search: string): number | undefined => {
  const normalized = search.replace(/\D/g, '')
  if (normalized.length !== 7) return undefined
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : undefined
}

const getSearchLabel = (address: {
  address?: string
  postalCode?: number
  municipalityName?: string
}): string =>
  [address.address, address.postalCode, address.municipalityName]
    .filter((value) => value !== undefined && value !== null && value !== '')
    .join(' ')

@Injectable()
export class FireCompensationAppraisalService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(FasteignirApi) private propertiesApi: FasteignirApi,
    @Inject(ApplicationApi)
    private hmsApplicationSystemService: ApplicationApi,
    @Inject(AttachmentS3Service)
    private readonly attachmentService: AttachmentS3Service,
    @Inject(NotificationsService)
    private readonly notificationsService: NotificationsService,
    @Inject(HmsService) private readonly hmsService: HmsService,
  ) {
    super(ApplicationTypes.FIRE_COMPENSATION_APPRAISAL)
  }

  private getRealEstatesWithAuth(auth: User) {
    return this.propertiesApi.withMiddleware(
      new AuthMiddleware(auth, { forwardUserInfo: true }),
    )
  }

  async getProperties({ auth, application }: TemplateApiModuleActionProps) {
    console.log('external data', application.externalData)
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
      let simpleProperties: FasteignSimpleWrapper | undefined
      const api = this.getRealEstatesWithAuth(auth)
      try {
        simpleProperties = await api.fasteignirGetFasteignir({
          kennitala: auth.nationalId,
        })
      } catch (error) {
        this.logger.warn(
          `Fetch properties list for applicationId: ${
            application.id
          } failed with problem:  ${
            error instanceof FetchError ? error.problem : error.message
          }`,
          error,
        )
      }

      try {
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
      } catch (error) {
        this.logger.warn(
          `Fetch property details for applicationId: ${
            application.id
          } failed with problem:  ${
            error instanceof FetchError ? error.problem : error.message
          }`,
          error,
        )
        throw new TemplateApiError(
          {
            title: getPropertiesErrorMessages.title,
            summary: getPropertiesErrorMessages.summary,
          },
          500,
        )
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
      const { selectedRealEstateId, realEstates, selectedRealEstate } =
        getSelectedRealEstate(application)

      if (!selectedRealEstateId) {
        throw new TemplateApiError('Selected real estate id is not set', 500)
      }

      if (!realEstates) {
        throw new TemplateApiError('Properties is undefined', 500)
      }

      const selectedUsageUnits = getValueViaPath<Array<string>>(
        application.answers,
        'usageUnits',
      )

      return paymentForAppraisal(
        sumSelectedUnitsFireCompensation(
          selectedRealEstate,
          selectedUsageUnits ?? [],
        ),
      )
    } catch (error) {
      this.logger.error(
        `Failed to calculate amount for applicationId: ${
          application.id
        } with problem: ${
          error instanceof FetchError ? error.problem : error.message
        }`,
        error,
      )
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
      const { selectedRealEstateId, selectedRealEstate } =
        getSelectedRealEstate(application)

      if (!selectedRealEstateId) {
        throw new TemplateApiError('Selected real estate id is not set', 500)
      }

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
        `Failed to send notification to all involved: ${
          e instanceof TemplateApiError ? e.problem : e.message
        }`,
        e.message,
      )
      // Dont throw error since this happens when the application has already been sent
    }
  }

  // Streams the uploaded photos to HMS, one at a time, in the background.
  private async uploadApplicationFiles(
    application: TemplateApiModuleActionProps['application'],
  ) {
    // Get the generator
    const fileGenerator = this.attachmentService.getFilesGenerator(
      application,
      ['photos'],
    )

    const uniqueFileKeys = new Set<string>()

    // Process one file at a time to avoid creating intermetiate arrays
    for await (const file of fileGenerator) {
      // Skip if the file has already been processed
      if (uniqueFileKeys.has(file.key)) {
        continue
      }
      uniqueFileKeys.add(file.key)
      const attachment = mapAnswersToSingleApplicationFilesContentDto(
        application,
        file,
      )
      // Kick off each upload as soon as the attachment has been downloaded and mapped
      this.hmsApplicationSystemService // Don't wait for upload to finish, allow them to run asyncronously on the background
        .apiApplicationUploadPost({
          applicationFilesContentDto: attachment,
        })
        .then((res) => {
          this.logger.info('Successfully uploaded attachment:', res)
        })
        .catch((e) => {
          // Log the error but don't throw it since we allow the uploads to run asyncronously on the background
          this.logger.error(
            `Failed to upload attachment: ${
              e instanceof TemplateApiError ? e.problem : e.message
            }`,
          )
        })
    }
  }

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    try {
      // Map the application to the dto interface
      const applicationDto = mapAnswersToApplicationDto(application)
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

      await this.uploadApplicationFiles(application)

      return res
    } catch (e) {
      this.logger.error(
        `Failed to submit application: ${
          e instanceof TemplateApiError ? e.problem : e.message
        }`,
        e,
      )
      throw new TemplateApiError(e, 500)
    }
  }

  // --- Functions only referenced by the SDF version of this application ---
  // The legacy (client-rendered) application does not reference any of the
  // methods below. They route here from the SDF template via the
  // `namespace: 'FireCompensationAppraisal'` on its template API definitions.

  // SDF variant of submitApplication. Differs only in the DTO mapping: SDF
  // display fields are not persisted to answers, so the two computed appraisal
  // values are recomputed from source instead of read from answers.
  async submitApplicationSdf({ application }: TemplateApiModuleActionProps) {
    try {
      const applicationDto = mapAnswersToApplicationDtoSdf(application)
      const res = await this.hmsApplicationSystemService.apiApplicationPost({
        applicationDto,
      })
      if (res.status !== 200) {
        throw new TemplateApiError(
          'Failed to submit application, non 200 status',
          500,
        )
      }

      await this.uploadApplicationFiles(application)

      return res
    } catch (e) {
      this.logger.error(
        `Failed to submit application: ${
          e instanceof TemplateApiError ? e.problem : e.message
        }`,
        e,
      )
      throw new TemplateApiError(e, 500)
    }
  }

  // Replaces the legacy `PropertySearch` custom component for the SDF
  // "apply for a property I do not own" flow (address / property-code search).
  async searchProperties({ application, auth }: TemplateApiModuleActionProps) {
    const search = getValueViaPath<SearchAnswer>(
      application.answers,
      'anyonesProperty',
    )
    const query = search?.query?.trim() ?? ''
    if (query.length < 3) {
      return { options: [] }
    }

    const selectedPropertyCode = cleanupSearch(query)
    if (selectedPropertyCode !== undefined) {
      const address = await this.hmsService.hmsPropertyCodeInfo(auth, {
        fasteignNr: selectedPropertyCode,
      })
      const option = {
        ...address,
        label: getSearchLabel(address),
        value: String(address.addressCode ?? ''),
        selectedPropertyCode,
      }
      const propertiesByAddressCode = address.addressCode
        ? await this.hmsService.hmsPropertyInfo(auth, {
            stadfangNr: address.addressCode,
            fasteignNr: selectedPropertyCode,
          })
        : []
      return { options: [option], propertiesByAddressCode }
    }

    const addresses = await this.hmsService.hmsSearch(auth, {
      partialStadfang: query,
    })
    const options = addresses.map((address) => ({
      ...address,
      label: getSearchLabel(address),
      value: String(address.addressCode ?? ''),
    }))
    return { options }
  }

  // Replaces the legacy `FetchPropertiesByCodes` custom component: fetches the
  // full property (incl. usage units / fire appraisal) for the selected code.
  async fetchPropertiesByCode({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<Array<Fasteign>> {
    const selectedCode = getValueViaPath<string>(
      application.answers,
      'selectedPropertyByCode',
    )
    if (!selectedCode) {
      return []
    }

    // Mock for dev, since there is no dev service for the propertiesApi.
    // Return a property keyed to the selected code so the downstream lookup
    // (`getSelectedProperty`, which joins on `fasteignanumer`) succeeds locally.
    if (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) {
      return [
        getMockedFasteign(
          'Vesturhóp 34, 240 Grindavík',
          'F' + selectedCode.replace(/\D/g, ''),
          [
            {
              notkunBirting: 'Íbúð á hæð',
              brunabotamat: 600000000,
              notkunareininganumer: '010101',
            },
            {
              notkunBirting: 'Bílskúr',
              brunabotamat: 45000000,
              notkunareininganumer: '010102',
            },
          ],
        ),
      ]
    }

    try {
      return (await this.hmsService.hmsPropertyByPropertyCode(auth, {
        fasteignNrs: [selectedCode],
      })) as Array<Fasteign>
    } catch (error) {
      this.logger.warn(
        `Fetch property by code for applicationId: ${
          application.id
        } failed with problem: ${
          error instanceof FetchError ? error.problem : error.message
        }`,
        error,
      )
      return []
    }
  }
}

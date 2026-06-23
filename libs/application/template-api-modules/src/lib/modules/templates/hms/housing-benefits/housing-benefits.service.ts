import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  ApplicationTypes,
  ApplicationWithAttachments,
  ChildrenCustodyInformationParameters,
  NotificationType,
} from '@island.is/application/types'
import { NotificationsService } from '../../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  SharedModuleConfig,
  TemplateApiModuleActionProps,
} from '../../../../types'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Contract, HomeApi } from '@island.is/clients/hms-rental-agreement'
import { HmsHousingBenefitsClientService } from '@island.is/clients/hms-housing-benefits'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { getValueViaPath } from '@island.is/application/core'
import { format as formatKennitala } from 'kennitala'
import { getConfigValue } from '../../../shared/shared.utils'
import { ContractStatus } from './types'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { mockGetRentalAgreements } from '../terminate-rental-agreement/mockedRentalAgreements'
import {
  doesDomicileAddressMatchContractProperty,
  filterContractsForHousingBenefits,
  getApplicantName,
  getApplicationLink,
  getPreviouslyNotifiedIds,
  getRejectReason,
  getRequestedExtraDataFiles,
  getRentalAddress,
  isLastAssigneeToComplete,
  mapApplicationToHousingBenefitsModel,
  normalizeNationalId,
} from './utils'
import {
  applyMockAssigneeNationalRegistryAddress,
  getAssigneePersonalTaxMockMode,
  getPersonalTaxMockMode,
  PersonalTaxMockMode,
  shouldOverlayMockAssigneeNationalRegistryAddress,
  useMockRentalAgreements,
} from './utils/mock'
import { NationalRegistryV3Service } from '../../../shared/api/national-registry-v3/national-registry-v3.service'
import { coreErrorMessages } from '@island.is/application/core'
import {
  getAssigneeApproverDisplayName,
  getAssigneeNationalIds,
} from '@island.is/application/templates/hms/housing-benefits'

@Injectable()
export class HousingBenefitsService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly homeApi: HomeApi,
    private readonly notificationsService: NotificationsService,
    private readonly nationalRegistryV3Service: NationalRegistryV3Service,
    private readonly configService: ConfigService<SharedModuleConfig>,
    private readonly hmsHousingBenefitsClientService: HmsHousingBenefitsClientService,
  ) {
    super(ApplicationTypes.HOUSING_BENEFITS)
  }

  // Trigger deployment

  private getClientLocationOrigin(): string {
    return getConfigValue(this.configService, 'clientLocationOrigin') as string
  }

  private async sendReadyForApplicantSubmitNotification(
    application: ApplicationWithAttachments,
  ): Promise<void> {
    const applicationLink = getApplicationLink(
      application,
      this.getClientLocationOrigin(),
    )
    const address = getRentalAddress(application)

    if (!address) {
      throw new TemplateApiError('Rental address is not set', 500)
    }

    await this.notificationsService.sendNotification({
      type: NotificationType.HmsHousingBenefitsReadyForApplicantSubmit,
      messageParties: {
        recipient: normalizeNationalId(application.applicant),
      },
      applicationId: application.id,
      args: {
        applicationLink,
        address,
      },
    })
  }

  async notifyAssignees({
    application,
  }: TemplateApiModuleActionProps): Promise<{ notifiedNationalIds: string[] }> {
    const applicantNationalId = normalizeNationalId(application.applicant)
    const applicantName = getApplicantName(application)
    const address = getRentalAddress(application)
    const applicationLink = getApplicationLink(
      application,
      this.getClientLocationOrigin(),
    )

    const previouslyNotified = getPreviouslyNotifiedIds(application)

    const recipients = Array.from(
      new Set(
        getAssigneeNationalIds(application)
          .map((id) => normalizeNationalId(id))
          .filter((id) => id && id !== applicantNationalId),
      ),
    ).filter((recipient) => !previouslyNotified.has(recipient))

    if (recipients.length === 0) {
      return { notifiedNationalIds: [...previouslyNotified] }
    }

    if (!applicantName) {
      throw new TemplateApiError('Applicant name is not set', 500)
    }
    if (!address) {
      throw new TemplateApiError('Rental address is not set', 500)
    }

    const results = await Promise.allSettled(
      recipients.map((recipient) =>
        this.notificationsService.sendNotification({
          type: NotificationType.HmsHousingBenefitsNotifyAssignee,
          messageParties: {
            recipient,
            sender: applicantNationalId,
          },
          applicationId: application.id,
          args: {
            applicantName,
            applicantNationalId: formatKennitala(applicantNationalId),
            address,
            applicationLink,
          },
        }),
      ),
    )

    const failed = results
      .map((result, index) => ({ result, recipient: recipients[index] }))
      .filter(
        (
          entry,
        ): entry is { result: PromiseRejectedResult; recipient: string } =>
          entry.result.status === 'rejected',
      )

    if (failed.length > 0) {
      this.logger.error(
        'Failed to send housing benefits assignee notifications',
        {
          applicationId: application.id,
          failedRecipients: failed.map(({ recipient, result }) => ({
            recipient,
            reason: result.reason,
          })),
        },
      )
      throw new TemplateApiError(
        'Failed to send notification to one or more assignees',
        500,
      )
    }

    return {
      notifiedNationalIds: [...previouslyNotified, ...recipients],
    }
  }

  async notifyApplicantOnAssigneeSubmit({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const applicantNationalId = normalizeNationalId(application.applicant)
    const authNationalId = normalizeNationalId(auth.nationalId)

    if (authNationalId === applicantNationalId) {
      return
    }

    if (isLastAssigneeToComplete(application, authNationalId)) {
      await this.sendReadyForApplicantSubmitNotification(application)
      return
    }

    const assigneeName = getAssigneeApproverDisplayName(
      application,
      authNationalId,
    )
    if (!assigneeName) {
      throw new TemplateApiError('Assignee name is not set', 500)
    }

    const applicationLink = getApplicationLink(
      application,
      this.getClientLocationOrigin(),
    )

    await this.notificationsService.sendNotification({
      type: NotificationType.HmsHousingBenefitsAssigneeApproved,
      messageParties: {
        recipient: applicantNationalId,
        sender: authNationalId,
      },
      applicationId: application.id,
      args: {
        assigneeName,
        applicationLink,
      },
    })
  }

  private async sendRejectedByInstitutionNotification(
    application: ApplicationWithAttachments,
  ): Promise<void> {
    const address = getRentalAddress(application)
    const rejectReason = getRejectReason(application)

    if (!address) {
      throw new TemplateApiError('Rental address is not set', 500)
    }

    await this.notificationsService.sendNotification({
      type: NotificationType.HmsHousingBenefitsRejectedByInstitution,
      messageParties: {
        recipient: normalizeNationalId(application.applicant),
      },
      applicationId: application.id,
      args: {
        address,
        rejectReason,
      },
    })
  }

  async notifyApplicantOnExtraDataRequested({
    application,
  }: TemplateApiModuleActionProps): Promise<void> {
    const applicationLink = getApplicationLink(
      application,
      this.getClientLocationOrigin(),
    )
    const address = getRentalAddress(application)

    if (!address) {
      throw new TemplateApiError('Rental address is not set', 500)
    }

    await this.notificationsService.sendNotification({
      type: NotificationType.HmsHousingBenefitsExtraDataRequested,
      messageParties: {
        recipient: normalizeNationalId(application.applicant),
      },
      applicationId: application.id,
      args: {
        applicationLink,
        address,
        files: getRequestedExtraDataFiles(application),
      },
    })
  }

  async notifyApplicantOnApprovedByInstitution({
    application,
  }: TemplateApiModuleActionProps): Promise<void> {
    const address = getRentalAddress(application)

    if (!address) {
      throw new TemplateApiError('Rental address is not set', 500)
    }

    await this.notificationsService.sendNotification({
      type: NotificationType.HmsHousingBenefitsApprovedByInstitution,
      messageParties: {
        recipient: normalizeNationalId(application.applicant),
      },
      applicationId: application.id,
      args: {
        address,
      },
    })
  }

  async notifyApplicantOnRejectedByInstitution({
    application,
  }: TemplateApiModuleActionProps): Promise<void> {
    await this.sendRejectedByInstitutionNotification(application)
  }

  async notifyApplicantOnAssigneeReject({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const applicantNationalId = normalizeNationalId(application.applicant)
    const authNationalId = normalizeNationalId(auth.nationalId)

    if (authNationalId === applicantNationalId) {
      return
    }

    if (isLastAssigneeToComplete(application, authNationalId)) {
      await this.sendReadyForApplicantSubmitNotification(application)
      return
    }

    const assigneeName = getAssigneeApproverDisplayName(
      application,
      authNationalId,
    )
    if (!assigneeName) {
      throw new TemplateApiError('Assignee name is not set', 500)
    }

    const applicationLink = getApplicationLink(
      application,
      this.getClientLocationOrigin(),
    )
    const address = getRentalAddress(application)

    if (!address) {
      throw new TemplateApiError('Rental address is not set', 500)
    }

    await this.notificationsService.sendNotification({
      type: NotificationType.HmsHousingBenefitsAssigneeRejected,
      messageParties: {
        recipient: applicantNationalId,
        sender: authNationalId,
      },
      applicationId: application.id,
      args: {
        assigneeName,
        address,
        applicationLink,
      },
    })
  }

  private homeApiWithAuth(auth: Auth) {
    return this.homeApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getRentalAgreements({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    try {
      let contracts: Contract[]

      const useMock = useMockRentalAgreements(application)

      if (useMock) {
        this.logger.debug('Using mock rental agreements (checkbox checked)')
        const mockAgreements = mockGetRentalAgreements()
        return filterContractsForHousingBenefits(
          mockAgreements,
          auth.nationalId,
        )
      }

      contracts = await this.homeApiWithAuth(auth)
        .contractKtKtGet({
          kt: auth.nationalId,
        })
        .then((res) => {
          return res
            .map((contract) => {
              if (contract.contractStatus === ContractStatus.STATUSVALID) {
                return contract
              }
            })
            .filter((contract): contract is Contract => contract !== undefined)
        })

      if (
        (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) &&
        contracts.length === 0
      ) {
        this.logger.debug('Mocking rental agreements (no contracts from API)')
        contracts = mockGetRentalAgreements()
      }

      return filterContractsForHousingBenefits(contracts, auth.nationalId)
    } catch (e) {
      if (e instanceof TemplateApiError) {
        // If it's already a TemplateApiError, throw it
        throw e
      }
      this.logger.error('Failed to fetch rental agreements:', e.message)
      throw new TemplateApiError(e, 500)
    }
  }

  /**
   * Whether a tax return was filed for the given year.
   *
   * TODO: Replace the mock resolution with the real Tax (Skatturinn) endpoint, which takes
   * (nationalId, year) and returns a boolean. The mock modes map as follows:
   *  - 'sample' / 'none': filed for every year
   *  - 'empty': never filed
   *  - 'fiveYears': not filed for last year, filed for any earlier year
   */
  private async checkTaxReturnFiledForYear(
    taxMockMode: PersonalTaxMockMode,
    year: number,
    lastYear: number,
  ): Promise<boolean> {
    switch (taxMockMode) {
      case 'empty':
        return false
      case 'fiveYears':
        return year < lastYear
      default:
        return true
    }
  }

  async getPersonalTaxReturn({ application }: TemplateApiModuleActionProps) {
    const lastYear = new Date().getFullYear() - 1

    const taxMockMode = getPersonalTaxMockMode(application)

    const handedInLastYear = await this.checkTaxReturnFiledForYear(
      taxMockMode,
      lastYear,
      lastYear,
    )

    if (handedInLastYear) {
      return {
        handedInLastYear: true,
        handedInLastFiveYears: true,
      }
    }

    let handedInLastFiveYears = false
    for (let year = lastYear - 1; year >= lastYear - 5; year--) {
      if (await this.checkTaxReturnFiledForYear(taxMockMode, year, lastYear)) {
        handedInLastFiveYears = true
        break
      }
    }

    this.logger.debug(
      `Tax return status: handedInLastYear=false, handedInLastFiveYears=${handedInLastFiveYears}`,
    )

    return {
      handedInLastYear: false,
      handedInLastFiveYears,
    }
  }

  async getAssigneePersonalTaxReturn({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const lastYear = new Date().getFullYear() - 1

    const taxMockMode = getAssigneePersonalTaxMockMode(
      application,
      auth.nationalId,
    )

    const handedInLastYear = await this.checkTaxReturnFiledForYear(
      taxMockMode,
      lastYear,
      lastYear,
    )

    if (handedInLastYear) {
      return {
        handedInLastYear: true,
        handedInLastFiveYears: true,
      }
    }

    let handedInLastFiveYears = false
    for (let year = lastYear - 1; year >= lastYear - 5; year--) {
      if (await this.checkTaxReturnFiledForYear(taxMockMode, year, lastYear)) {
        handedInLastFiveYears = true
        break
      }
    }

    return {
      handedInLastYear: false,
      handedInLastFiveYears,
    }
  }

  async getHouseholdMembers(props: TemplateApiModuleActionProps) {
    try {
      const cohabitants =
        await this.nationalRegistryV3Service.getCohabitantsDetailed(props)
      return (
        cohabitants
          ?.filter((c): c is NonNullable<typeof c> => c !== null)
          .map((person) => ({
            name: person.fullName ?? '',
            nationalId: person.nationalId ?? '',
          }))
          .filter((m) => m.nationalId) ?? []
      )
    } catch (e) {
      this.logger.error(
        'Failed to fetch household members from National Registry:',
        e,
      )
      throw new TemplateApiError(e, 500)
    }
  }

  /**
   * Uses the signed-in user’s lögheimilistengsl (same source as getHouseholdMembers). For each
   * rental contract, returns those people whose legal domicile matches the contract property
   * (street + postal code). Requires `getRentalAgreements` to have run first.
   */
  async getDomicileResidentsByRentalContracts(
    props: TemplateApiModuleActionProps,
  ) {
    const { application } = props
    const contracts = getValueViaPath<Contract[] | undefined>(
      application.externalData,
      'getRentalAgreements.data',
    )
    if (!Array.isArray(contracts) || contracts.length === 0) {
      return { contracts: [] as const }
    }

    let domicileGroup
    try {
      domicileGroup =
        await this.nationalRegistryV3Service.getCohabitantsDetailed(props)
    } catch (e) {
      this.logger.error(
        'Failed to fetch lögheimilistengsl for domicile residents:',
        e,
      )
      throw e instanceof TemplateApiError ? e : new TemplateApiError(e, 500)
    }

    const people = domicileGroup.filter(
      (p): p is NonNullable<typeof p> => p !== null && Boolean(p.nationalId),
    )

    return {
      contracts: contracts.map((contract) => {
        const contractId =
          contract.contractId !== undefined && contract.contractId !== null
            ? String(contract.contractId)
            : ''
        const property = contract.contractProperty?.[0]
        if (!property) {
          return { contractId, residents: [] as const }
        }
        return {
          contractId,
          residents: people
            .filter((person) =>
              doesDomicileAddressMatchContractProperty(
                person.address,
                property,
              ),
            )
            .map((person) => ({
              nationalId: person.nationalId,
              name: person.fullName,
            })),
        }
      }),
    }
  }

  async assigneeNationalRegistry({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    try {
      const individual = await this.nationalRegistryV3Service.getIndividual(
        auth.nationalId,
        auth,
      )

      if (!individual) {
        throw new TemplateApiError(
          {
            title: coreErrorMessages.nationalRegistryAgeLimitNotMetTitle,
            summary: coreErrorMessages.failedDataProvider,
          },
          404,
        )
      }

      const overlayMock = shouldOverlayMockAssigneeNationalRegistryAddress(
        application,
        {
          isDevOrLocal:
            isRunningOnEnvironment('local') || isRunningOnEnvironment('dev'),
        },
        auth.nationalId,
      )

      if (overlayMock) {
        return applyMockAssigneeNationalRegistryAddress(individual)
      }

      return individual
    } catch (e) {
      if (e instanceof TemplateApiError) {
        throw e
      }
      this.logger.error('Failed to fetch individual from National Registry:', e)
      throw new TemplateApiError(e, 500)
    }
  }

  /**
   * Children in the signing assignee’s custody (same Þjónusta as applicant’s childrenCustody).
   */
  async assigneeChildrenCustodyInformation(
    props: TemplateApiModuleActionProps<ChildrenCustodyInformationParameters>,
  ) {
    return this.nationalRegistryV3Service.childrenCustodyInformation(props)
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const existingApplicationNumber = getValueViaPath<number>(
      application.externalData,
      'submitApplication.data.applicationNumber',
    )
    if (existingApplicationNumber) {
      return {
        applicationNumber: existingApplicationNumber,
        success: true,
      }
    }

    try {
      const res = await this.hmsHousingBenefitsClientService.hmsPaymentHistory(
        auth,
        {
          version: '1',
          dateFrom: new Date('2026-01-01'),
          dateTo: new Date(),
          pageNumber: 1,
          pageSize: 100,
        },
      )
      // console.log('--------------------------------')
      // console.log('payment history response')
      // console.dir(res, { depth: null, colors: true })
      // console.log('--------------------------------')
      const model = mapApplicationToHousingBenefitsModel(application)
      const result =
        await this.hmsHousingBenefitsClientService.createHousingBenefitsApplication(
          auth,
          model,
        )

      if (!result.success) {
        throw new TemplateApiError(
          'Failed to submit housing benefits application',
          500,
        )
      }

      return {
        applicationNumber: result.applicationNumber,
        success: result.success,
      }
    } catch (e) {
      if (e instanceof TemplateApiError) {
        throw e
      }

      if (e instanceof Response) {
        const status = e.status
        let body: string
        try {
          body = await e.text()
        } catch {
          body = 'Could not read response body'
        }
        this.logger.error('Failed to submit housing benefits application', {
          status,
          body,
        })
        throw new TemplateApiError(
          {
            title: 'Failed to submit housing benefits application',
            summary: `HMS API returned ${status}: ${body}`,
          },
          500,
        )
      }

      this.logger.error('Failed to submit housing benefits application:', e)
      throw new TemplateApiError(
        {
          title: 'Failed to submit housing benefits application',
          summary: e instanceof Error ? e.message : String(e),
        },
        500,
      )
    }
  }
}

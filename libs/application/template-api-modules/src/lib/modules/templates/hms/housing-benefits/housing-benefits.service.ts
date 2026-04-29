import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import {
  ApplicationTypes,
  ChildrenCustodyInformationParameters,
} from '@island.is/application/types'
import { NotificationsService } from '../../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiError } from '@island.is/nest/problem'
import { TemplateApiModuleActionProps } from '../../../..'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Contract, HomeApi } from '@island.is/clients/hms-rental-agreement'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { getValueViaPath } from '@island.is/application/core'
import { ContractStatus } from './types'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { mockGetRentalAgreements } from '../terminate-rental-agreement/mockedRentalAgreements'
import {
  doesDomicileAddressMatchContractProperty,
  filterContractsForHousingBenefits,
} from './utils'
import {
  applyMockAssigneeNationalRegistryAddress,
  getAssigneePersonalTaxMockMode,
  getPersonalTaxMockMode,
  shouldOverlayMockAssigneeNationalRegistryAddress,
  useMockRentalAgreements,
} from './utils/mock'
import { NationalRegistryV3Service } from '../../../shared/api/national-registry-v3/national-registry-v3.service'
import { coreErrorMessages } from '@island.is/application/core'

@Injectable()
export class HousingBenefitsService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly homeApi: HomeApi,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
    private readonly nationalRegistryV3Service: NationalRegistryV3Service,
  ) {
    super(ApplicationTypes.HOUSING_BENEFITS)
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

  async getPersonalTaxReturn({ application }: TemplateApiModuleActionProps) {
    const lastYear = new Date().getFullYear() - 1

    const taxMockMode = getPersonalTaxMockMode(application)

    // TODO: Replace with real API call once the endpoint exists
    const taxReturnFiled = taxMockMode !== 'empty'

    this.logger.debug(
      `Mocking tax return status for ${lastYear}: filed=${taxReturnFiled}`,
    )

    return {
      year: lastYear,
      taxReturnFiled,
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

    const taxReturnFiled = taxMockMode !== 'empty'

    this.logger.debug(
      `Mocking assignee tax return status for ${lastYear}: filed=${taxReturnFiled}`,
    )

    return {
      year: lastYear,
      taxReturnFiled,
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
      domicileGroup = await this.nationalRegistryV3Service.getCohabitantsDetailed(
        props,
      )
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

  async submitApplication() {
    // TODO: Implement this
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      id: 1337,
    }
  }
}

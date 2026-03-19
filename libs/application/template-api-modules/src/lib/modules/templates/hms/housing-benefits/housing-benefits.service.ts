import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiError } from '@island.is/nest/problem'
import { TemplateApiModuleActionProps } from '../../../..'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { getValueViaPath } from '@island.is/application/core'
import { Contract, HomeApi } from '@island.is/clients/hms-rental-agreement'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { ContractStatus } from './types'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { mockGetRentalAgreements } from '../terminate-rental-agreement/mockedRentalAgreements'
import { filterContractsForHousingBenefits } from './utils'
import { NationalRegistryV3Service } from '../../../shared/api/national-registry-v3/national-registry-v3.service'

const useMockRentalAgreements = (application: {
  answers?: Record<string, unknown>
}): boolean => {
  const mockData = getValueViaPath<string[]>(
    application?.answers ?? {},
    'mockData',
  )
  return Array.isArray(mockData) && mockData.includes('yes')
}

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
        // Skip filtering when using mock - allows testing with any user
        return mockGetRentalAgreements()
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

  async submitApplication() {
    // TODO: Implement this
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      id: 1337,
    }
  }
}

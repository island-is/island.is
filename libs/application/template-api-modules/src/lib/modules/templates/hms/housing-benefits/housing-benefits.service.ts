import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiError } from '@island.is/nest/problem'
import { TemplateApiModuleActionProps } from '../../../..'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Contract, HomeApi } from '@island.is/clients/hms-rental-agreement'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { ContractStatus } from './types'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { mockGetRentalAgreements } from '../terminate-rental-agreement/mockedRentalAgreements'
import { filterContractsForHousingBenefits } from './utils'
import {
  getEmptyMockPersonalTaxReturn,
  getMockPersonalTaxReturn,
  getPersonalTaxMockMode,
  useMockRentalAgreements,
} from './utils/mock'
import { NationalRegistryV3Service } from '../../../shared/api/national-registry-v3/national-registry-v3.service'
import { PersonalTaxReturnApi } from '@island.is/clients/rsk/personal-tax-return'
import { coreErrorMessages } from '@island.is/application/core'

@Injectable()
export class HousingBenefitsService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly homeApi: HomeApi,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
    private readonly nationalRegistryV3Service: NationalRegistryV3Service,
    private readonly personalTaxReturnApi: PersonalTaxReturnApi,
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

  async getPersonalTaxReturn({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const lastYear = new Date().getFullYear() - 1
    const from = { year: lastYear, month: 1 }
    const to = { year: lastYear, month: 12 }

    const taxMockMode = getPersonalTaxMockMode(application)
    if (taxMockMode === 'sample') {
      this.logger.debug('Using mock direct tax payments (sample data)')
      return getMockPersonalTaxReturn(lastYear)
    }
    if (taxMockMode === 'empty') {
      this.logger.debug('Using mock direct tax payments (empty success)')
      return getEmptyMockPersonalTaxReturn(lastYear)
    }

    try {
      const result = await this.personalTaxReturnApi.directTaxPayments(
        auth.nationalId,
        from,
        to,
      )

      if (!result.success) {
        throw new TemplateApiError(
          {
            title: coreErrorMessages.failedDataProvider,
            summary: coreErrorMessages.errorDataProvider,
          },
          502,
        )
      }

      const salaryBreakdown = result.salaryBreakdown ?? []

      return {
        year: lastYear,
        directTaxPayments: salaryBreakdown.map((row) => ({
          totalSalary: row.salaryTotal,
          payerNationalId: row.payerNationalId.toString(),
          personalAllowance: row.personalAllowance,
          withheldAtSource: row.salaryWithheldAtSource,
          month: row.period,
          year: row.year,
        })),
      }
    } catch (e) {
      if (e instanceof TemplateApiError) {
        throw e
      }
      this.logger.error('Failed to fetch direct tax payments:', e)
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

  test(props: TemplateApiModuleActionProps) {
    return {
      id: 1337,
      message: 'This seems to work...',
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

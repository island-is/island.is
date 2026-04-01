import { User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import {
  SocialInsuranceAdministrationDisabilityPensionService,
  SocialInsuranceAdministrationGeneralService,
  SocialInsuranceAdministrationIncomePlanService,
  SocialInsuranceAdministrationPaymentPlanService,
  SocialInsuranceAdministrationPaymentTypesOverviewService,
  SocialInsuranceAdministrationPensionCalculatorService,
  SocialInsuranceAdministrationPersonalTaxCreditService,
  TrWebApiServicesCommonClientsModelsSetPersonalTaxAllowanceInput,
  TrWebApiServicesCommonClientsModelsEditPersonalTaxAllowanceInput,
  TrWebApiServicesCommonClientsModelsDiscontinuePersonalTaxUsageInput,
  TrWebApiServicesCommonClientsModelsSpouseTaxCardUsageDueToDeathInput,
  TrWebCommonsExternalPortalsApiModelsPaymentPlanPaymentPlanDto,
} from '@island.is/clients/social-insurance-administration'
import {
  CmsElasticsearchService,
  CustomPageUniqueIdentifier,
} from '@island.is/cms'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { isDefined } from '@island.is/shared/utils'
import { Inject, Injectable } from '@nestjs/common'
import { PensionCalculationInput } from './dtos/pensionCalculation.input'
import { TemporaryCalculationInput } from './dtos/temporaryCalculation.input'
import { IncomePlan } from './models/income/incomePlan.model'
import { IncomePlanEligbility } from './models/income/incomePlanEligibility.model'
import { PaymentGroup } from './models/payments/paymentGroup.model'
import { mapToPaymentGroupType } from './models/payments/paymentGroupType.model'
import { PersonalTaxCredit } from './models/personalTaxCredit/taxCard.model'
import { PaymentPlan } from './models/payments/paymentPlan.model'
import { Payments } from './models/payments/payments.model'
import { PensionCalculationResponse } from './models/pension/pensionCalculation.model'
import { LOG_CATEGORY } from './socialInsurance.type'
import {
  getPensionCalculationHighlightedItems,
  groupPensionCalculationItems,
  mapPensionCalculationInput,
  toYearWithMonths,
} from './utils'
import { Locale } from '@island.is/shared/types'
import { mapDisabilityPensionCertificate } from './mappers/mapDisabilityPensionCertificate'
import { DisabilityPensionCertificate } from './models/medicalDocuments/disabilityPensionCertificate.model'
import { parseIncomePlanStatus } from './mappers/parseIncomePlanStatus'
import {
  mapBenefitChildInformation,
  mapPaymentTypeOverview,
} from './mappers/mapPaymentTypesOverview'
import { PaymentTypesOverviewResult } from './models/paymentTypes/paymentTypesOverviewResult.model'

@Injectable()
export class SocialInsuranceService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly cmsElasticService: CmsElasticsearchService,
    private readonly generalService: SocialInsuranceAdministrationGeneralService,
    private readonly disabilityPensionService: SocialInsuranceAdministrationDisabilityPensionService,
    private readonly pensionCalculatorService: SocialInsuranceAdministrationPensionCalculatorService,
    private readonly incomePlanService: SocialInsuranceAdministrationIncomePlanService,
    private readonly paymentService: SocialInsuranceAdministrationPaymentPlanService,
    private readonly personalTaxCreditClient: SocialInsuranceAdministrationPersonalTaxCreditService,
    private readonly paymentTypesOverviewClient: SocialInsuranceAdministrationPaymentTypesOverviewService,
  ) {}

  async getPayments(user: User): Promise<Payments | undefined> {
    const payments = await this.paymentService
      .getPayments(user)
      .catch(handle404)

    if (!payments) {
      return undefined
    }

    //if no data
    if (!payments.nextPayment && !payments.previousPayment) {
      return undefined
    }

    return {
      nextPayment: payments.nextPayment ?? undefined,
      previousPayment: payments.previousPayment ?? undefined,
    }
  }

  async getPaymentPlan(user: User): Promise<PaymentPlan | undefined> {
    const paymentPlan = await this.paymentService
      .getPaymentPlan(user)
      .catch(handle404)

    if (!paymentPlan) {
      return undefined
    }

    const paymentGroups: Array<PaymentGroup> =
      paymentPlan?.groups
        ?.map((g) => {
          if (!g.group) {
            return null
          }

          return {
            type: mapToPaymentGroupType(g.groupId ?? undefined),
            name: g.group,
            totalYearCumulativeAmount: g.total ?? 0,
            monthlyPaymentHistory:
              g.monthTotals
                ?.map((mt) => {
                  if (!mt.month) {
                    return null
                  }
                  return {
                    monthIndex: mt.month,
                    amount: mt.amount ?? 0,
                  }
                })
                .filter(isDefined) ?? [],
            payments:
              g.rows
                ?.map((r) => {
                  if (!r.name) {
                    return null
                  }
                  return {
                    name: r.name,
                    totalYearCumulativeAmount: r.total ?? 0,
                    markWithAsterisk: r.markWithAsterisk ?? undefined,
                    monthlyPaymentHistory:
                      r.months
                        ?.map((m) => {
                          if (!m.month) {
                            return null
                          }
                          return {
                            monthIndex: m.month,
                            amount: m.amount ?? 0,
                          }
                        })
                        .filter(isDefined) ?? [],
                  }
                })
                .filter(isDefined) ?? [],
          }
        })
        .filter(isDefined) ?? []

    if (!paymentGroups.length) {
      return undefined
    }

    return {
      totalPayments: paymentPlan.totalPayment ?? undefined,
      totalPaymentsReceived: paymentPlan.paidOut ?? undefined,
      totalPaymentsSubtraction: paymentPlan.subtracted ?? undefined,
      paymentGroups,
    }
  }

  async getIncomePlan(user: User): Promise<IncomePlan | undefined> {
    const data = await this.incomePlanService.getLatestIncomePlan(user)

    if (!data?.registrationDate || !data?.status || !data.incomeTypeLines) {
      this.logger.info('Income plan incomplete, returning', {
        category: LOG_CATEGORY,
      })
      return
    }

    let hasIncompleteLines = false
    const incomeCategories = data.incomeTypeLines
      .map((i) => {
        if (!i.incomeTypeName || !i.incomeCategoryName || !i.totalSum) {
          hasIncompleteLines = true
          return undefined
        }
        return {
          name: i.incomeCategoryName,
          typeName: i.incomeTypeName,
          annualSum: i.totalSum,
          currency: i.currency ?? undefined,
        }
      })
      .filter(isDefined)

    if (hasIncompleteLines) {
      this.logger.info(
        'Income category data filtered out some incomplete lines',
        {
          category: LOG_CATEGORY,
        },
      )
    }

    return {
      registrationDate: data.registrationDate,
      status: parseIncomePlanStatus(data.status),
      incomeCategories,
    }
  }

  async getIncomePlanChangeEligibility(
    user: User,
  ): Promise<IncomePlanEligbility> {
    const data = await this.incomePlanService.isUserEligibleForIncomePlan(user)

    return {
      isEligible: data.isEligible ?? undefined,
      reason: data.reason ?? undefined,
    }
  }

  async getPensionCalculation(
    input: PensionCalculationInput,
  ): Promise<PensionCalculationResponse> {
    const pageData = await this.cmsElasticService.getCustomPage({
      lang: 'is',
      uniqueIdentifier: CustomPageUniqueIdentifier.PensionCalculator,
    })

    const mappedInput = mapPensionCalculationInput(input, pageData)
    const calculation =
      await this.pensionCalculatorService.getPensionCalculation(mappedInput)

    const groups = groupPensionCalculationItems(calculation, pageData)
    const highlightedItems = getPensionCalculationHighlightedItems(
      calculation,
      pageData,
    )

    return {
      highlightedItems,
      groups,
    }
  }

  async getTemporaryCalculations(
    user: User,
    input: TemporaryCalculationInput,
  ): Promise<TrWebCommonsExternalPortalsApiModelsPaymentPlanPaymentPlanDto> {
    return await this.incomePlanService.getTemporaryCalculations(user, input)
  }

  async getDisabilityPensionCertificate(
    user: User,
    locale: Locale,
  ): Promise<DisabilityPensionCertificate | null> {
    const data = await this.disabilityPensionService
      .getCertificateForDisabilityPension(user)
      .catch(handle404)
    return data ? mapDisabilityPensionCertificate(data, locale) : null
  }

  async getCountries(user: User, locale: Locale) {
    const data = (await this.generalService.getCountries(user, locale)) ?? []
    return data.map((data) => ({
      code: data.value,
      name: data.label,
    }))
  }

  async getPersonalTaxCredit(user: User): Promise<PersonalTaxCredit | null> {
    const [taxCardsResult, spouseEligibility] = await Promise.all([
      this.personalTaxCreditClient.getTaxCards(user),
      this.personalTaxCreditClient.getSpouseDeceasedTaxAllowanceValidMonthsAndYears(
        user,
      ),
    ])

    const registrationMonthsAndYears = taxCardsResult?.canEditPersonalAllowance
      ? undefined
      : await this.personalTaxCreditClient.getTaxCardMonthsAndYears(user)

    const discontinuingMonthsAndYears =
      taxCardsResult?.canDiscontinuePersonalAllowance
        ? await this.personalTaxCreditClient.getTaxCardMonthsAndYearsWhenDiscontinuing(
            user,
          )
        : undefined

    return {
      taxCards: taxCardsResult?.taxCards?.map((tc) => ({
        ...tc,
        validFrom: tc.validFrom ?? undefined,
        validTo: tc.validTo ?? undefined,
        taxCardType: tc.taxCardType ?? undefined,
        percentage: tc.percentage ?? undefined,
      })),
      canEdit: taxCardsResult?.canEditPersonalAllowance,
      canDiscontinue: taxCardsResult?.canDiscontinuePersonalAllowance,
      registrationMonthsAndYears: toYearWithMonths(registrationMonthsAndYears),
      discontinuingMonthsAndYears: toYearWithMonths(
        discontinuingMonthsAndYears,
      ),
      spouseEligibility: spouseEligibility
        ? {
            ...spouseEligibility,
            allowedYearMonths: toYearWithMonths(
              spouseEligibility.allowedYearMonths,
            ),
          }
        : undefined,
    }
  }

  async setTaxCardAllowance(
    user: User,
    input: TrWebApiServicesCommonClientsModelsSetPersonalTaxAllowanceInput,
  ): Promise<void> {
    return this.personalTaxCreditClient.setTaxCardAllowance(user, input)
  }

  async editTaxCardAllowance(
    user: User,
    input: TrWebApiServicesCommonClientsModelsEditPersonalTaxAllowanceInput,
  ): Promise<void> {
    return this.personalTaxCreditClient.editTaxCardAllowance(user, input)
  }

  async discontinueTaxCardAllowance(
    user: User,
    input: TrWebApiServicesCommonClientsModelsDiscontinuePersonalTaxUsageInput,
  ): Promise<void> {
    return this.personalTaxCreditClient.discontinueTaxCardAllowance(user, input)
  }

  async setSpouseTaxCard(user: User): Promise<void> {
    return this.personalTaxCreditClient.setSpouseTaxCard(user, {})
  }

  async setSpouseTaxCardDueToDeath(
    user: User,
    input: TrWebApiServicesCommonClientsModelsSpouseTaxCardUsageDueToDeathInput,
  ): Promise<void> {
    return this.personalTaxCreditClient.setSpouseTaxCardDueToDeath(user, input)
  }

  async getPaymentTypesOverview(
    user: User,
  ): Promise<PaymentTypesOverviewResult | null> {
    try {
      const [paymentTypes, benefitChildren] = await Promise.all([
        this.paymentTypesOverviewClient.getPaymentTypesOverview(user),
        this.paymentTypesOverviewClient.getBenefitChildrenInformation(user),
      ])
      if (!paymentTypes && !benefitChildren) return null
      return {
        paymentTypes: paymentTypes?.map(mapPaymentTypeOverview),
        benefitChildren: benefitChildren?.map(mapBenefitChildInformation),
      }
    } catch (error) {
      this.logger.warn('Payment types overview fetch failed', {
        category: LOG_CATEGORY,
        error,
      })
      throw error
    }
  }
}

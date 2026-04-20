import { ApplicationWithAttachments } from '@island.is/application/types'
import { getValueViaPath, NO, YES } from '@island.is/application/core'
import {
  CompanyConditionsDT,
  ConditionsDT,
  DebtsAndSchedulesDT,
  DefaultApi,
  DistributionInitialPosition,
  ScheduleType,
} from '@island.is/clients/payment-schedule'
import { Inject, Injectable } from '@nestjs/common'
import { mockData } from './mockData'
import { isPerson } from 'kennitala'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'
import { errorModal } from '@island.is/application/templates/public-debt-payment-plan'
import { ProviderErrorReason } from '@island.is/shared/problem'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

@Injectable()
export class PrerequisitesService {
  constructor(
    private paymentScheduleApi: DefaultApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  paymentScheduleApiWithAuth(auth: Auth) {
    return this.paymentScheduleApi.withMiddleware(new AuthMiddleware(auth))
  }

  /**
   * Gathers data from FJS payment plan APIs schedules, debts and conditions
   * and returns them as a single object for the template to use. Whether the
   * applicant is a person or a company
   * Throws a Template API 404 error if the applicants prerequisites are not met.
   * @param auth
   * @param application
   * @returns
   * */
  async provide(application: ApplicationWithAttachments, auth: User) {
    const fakeData = getValueViaPath(application.answers, 'mock') as {
      useMockData: typeof YES | typeof NO
    }
    if (
      fakeData?.useMockData === YES &&
      (isRunningOnEnvironment('dev') || isRunningOnEnvironment('local'))
    ) {
      return this.getMockData()
    }

    return isPerson(auth.nationalId)
      ? this.personPrerequisites(auth)
      : this.companyPrerequisites(auth)
  }

  private async companyPrerequisites(auth: User) {
    const conditions = await this.getCompanyConditions(auth)

    const debts = await this.getDebts(auth)
    const allInitialSchedules = [] as DistributionInitialPosition[]
    for (const debt of debts) {
      const initialSchedule = await this.getInitalSchedule(
        auth,
        0,
        debt.type,
        debt.totalAmount,
      )

      allInitialSchedules.push(initialSchedule)
    }

    if (this.companyConditionsAreNotMetForApplicaiton(conditions, debts)) {
      const reasons = this.getCompanyErrorReason(conditions)
      throw new TemplateApiError(reasons, 404)
    }

    return {
      conditions,
      debts,
      allInitialSchedules,
    }
  }

  private async personPrerequisites(auth: User) {
    const conditions = await this.getConditions(auth)

    const debts = await this.getDebts(auth)

    const employer = await this.getCurrentEmployer(auth)

    const allInitialSchedules = [] as DistributionInitialPosition[]
    for (const debt of debts) {
      const initialSchedule = await this.getInitalSchedule(
        auth,
        conditions.disposableIncome,
        debt.type,
        debt.totalAmount,
      )

      allInitialSchedules.push(initialSchedule)
    }

    if (this.conditionsAreNotMetForApplicaiton(conditions, debts)) {
      const reasons = this.getErrorReason(conditions)
      throw new TemplateApiError(reasons, 404)
    }

    return {
      conditions,
      debts,
      allInitialSchedules,
      employer,
    }
  }

  private conditionsAreNotMetForApplicaiton(
    conditions: ConditionsDT,
    debts: DebtsAndSchedulesDT[],
  ): boolean {
    return (
      conditions.maxDebt ||
      !conditions.taxReturns ||
      !conditions.vatReturns ||
      !conditions.citReturns ||
      !conditions.accommodationTaxReturns ||
      !conditions.withholdingTaxReturns ||
      !conditions.wageReturns ||
      conditions.collectionActions ||
      !conditions.doNotOwe ||
      debts.length <= 0
    )
  }

  private companyConditionsAreNotMetForApplicaiton(
    conditions: CompanyConditionsDT,
    debts: DebtsAndSchedulesDT[],
  ): boolean {
    return (
      conditions.maxDebt ||
      !conditions.taxReturns ||
      !conditions.vatReturns ||
      !conditions.citReturns ||
      !conditions.accommodationTaxReturns ||
      !conditions.withholdingTaxReturns ||
      conditions.collectionActions ||
      // !conditions.financialStatement || TODO: Should include this check? (financial statement)
      !conditions.doNotOwe ||
      debts.length <= 0
    )
  }

  private async getConditions(auth: User): Promise<ConditionsDT> {
    const { conditions, error } = await this.paymentScheduleApiWithAuth(
      auth,
    ).conditionsnationalIdGET3({
      nationalId: auth.nationalId,
    })

    if (error) {
      this.logger.error('Error getting conditions', error)
      throw new Error('Error getting conditions')
    }

    if (!conditions) {
      throw new Error('No conditions found for nationalId')
    }
    return conditions
  }

  private async getCompanyConditions(auth: User): Promise<CompanyConditionsDT> {
    const { conditions, error } = await this.paymentScheduleApiWithAuth(
      auth,
    ).companyConditionsnationalIdGET8({
      nationalId: auth.nationalId,
    })

    if (error) {
      this.logger.error('Error getting company conditions', error)
      throw new Error('Error getting company conditions')
    }

    if (!conditions) {
      throw new Error('No company conditions found for nationalId')
    }

    return conditions
  }

  private async getDebts(auth: User): Promise<DebtsAndSchedulesDT[]> {
    const { deptAndSchedules, error } = await this.paymentScheduleApiWithAuth(
      auth,
    ).debtsandschedulesnationalIdGET2({
      nationalId: auth.nationalId,
    })
    if (error) {
      this.logger.error('Error getting debts', error)
      throw new Error('Error getting debts')
    }
    if (!deptAndSchedules) {
      throw new Error('No debts found for nationalId')
    }

    return deptAndSchedules.map((debt) => {
      const indexOfS = Object.values(ScheduleType).indexOf(
        debt.type as unknown as ScheduleType,
      )
      const key = Object.keys(ScheduleType)[indexOfS]
      return {
        ...debt,
        type: key,
      }
    })
  }

  private async getInitalSchedule(
    user: User,
    disposableIncome: number,
    scheduleType: string,
    totalDebtAmount: number,
  ): Promise<DistributionInitialPosition> {
    const indexOfScheduleType = Object.keys(ScheduleType).indexOf(scheduleType)
    const scheduleTypeValue = Object.values(ScheduleType)[indexOfScheduleType]

    const { distributionInitialPosition, error } =
      await this.paymentScheduleApiWithAuth(
        user,
      ).distributionInitialPositionnationalIdscheduleTypeGET4({
        disposableIncome,
        nationalId: user.nationalId,
        scheduleType: scheduleTypeValue,
        totalAmount: totalDebtAmount,
      })

    if (error) {
      this.logger.error('Error getting initial schedule', error)
      throw new Error('Error getting initial schedule')
    }

    return {
      ...distributionInitialPosition,
      scheduleType: scheduleType,
    }
  }

  private async getCurrentEmployer(auth: User): Promise<{
    name: string
    nationalId: string
  }> {
    const { wagesDeduction, error } = await this.paymentScheduleApiWithAuth(
      auth,
    ).wagesdeductionnationalIdGET1({
      nationalId: auth.nationalId,
    })
    if (error) {
      this.logger.error('Error employer information for nationalId', error)
      throw new Error('Error employer information for nationalId')
    }

    if (!wagesDeduction) {
      throw new Error('No employer found for nationalId')
    }

    return {
      name: wagesDeduction.employerName,
      nationalId: wagesDeduction.employerNationalId,
    }
  }

  private getErrorReason(conditions: ConditionsDT): ProviderErrorReason[] {
    const errors: ProviderErrorReason[] = []
    if (conditions.maxDebt) {
      errors.push({
        title: errorModal.maxDebtModal.title,
        summary: errorModal.maxDebtModal.summary,
      })
    }

    if (conditions.collectionActions) {
      errors.push({
        title: errorModal.defaultPaymentCollection.title,
        summary: errorModal.defaultPaymentCollection.summary,
      })
    }

    if (!conditions.doNotOwe) {
      errors.push({
        title: errorModal.doNotOwe.title,
        summary: errorModal.doNotOwe.summary,
      })
    }

    if (
      !conditions.taxReturns ||
      !conditions.vatReturns ||
      !conditions.citReturns ||
      !conditions.accommodationTaxReturns ||
      !conditions.withholdingTaxReturns ||
      !conditions.wageReturns
    ) {
      errors.push({
        title: errorModal.estimationOfReturns.title,
        summary: errorModal.estimationOfReturns.summary,
      })
    }
    errors.push({
      title: errorModal.noDebts.title,
      summary: errorModal.noDebts.summary,
    })
    return errors
  }

  private getCompanyErrorReason(
    conditions: CompanyConditionsDT,
  ): ProviderErrorReason[] {
    const errors: ProviderErrorReason[] = []

    if (conditions.maxDebt) {
      errors.push({
        title: errorModal.maxDebtModal.title,
        summary: errorModal.maxDebtModal.summary,
      })
    }

    if (conditions.collectionActions) {
      errors.push({
        title: errorModal.defaultPaymentCollection.title,
        summary: errorModal.defaultPaymentCollection.summary,
      })
    }

    if (!conditions.doNotOwe) {
      errors.push({
        title: errorModal.doNotOwe.title,
        summary: errorModal.doNotOwe.summary,
      })
    }

    if (
      !conditions.taxReturns ||
      !conditions.vatReturns ||
      !conditions.citReturns ||
      !conditions.accommodationTaxReturns ||
      !conditions.withholdingTaxReturns
    ) {
      errors.push({
        title: errorModal.estimationOfReturns.title,
        summary: errorModal.estimationOfReturns.summary,
      })
    }

    errors.push({
      title: errorModal.noDebts.title,
      summary: errorModal.noDebts.summary,
    })
    return errors
  }

  private getMockData() {
    return {
      conditions: mockData.data.conditions,
      debts: mockData.data.debts as DebtsAndSchedulesDT[],
      allInitialSchedules: mockData.data
        .allInitialSchedules as DistributionInitialPosition[],
      employer: mockData.data.employer,
    }
  }
}

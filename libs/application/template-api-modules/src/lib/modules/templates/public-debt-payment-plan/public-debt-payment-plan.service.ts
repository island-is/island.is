import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ApplicationTypes,
  NO,
  YES,
} from '@island.is/application/types'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  ConditionsDT,
  DebtsAndSchedulesDT,
  DefaultApi,
  DistributionInitialPosition,
  PaymentsDT,
  ScheduleType,
} from '@island.is/clients/payment-schedule'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'
import { Inject, Injectable } from '@nestjs/common'

import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  PublicDebtPaymentPlanPayment,
  PublicDebtPaymentPlanPaymentCollection,
  PublicDebtPaymentPlanPrerequisites,
} from './types'
import { errorModal } from '@island.is/application/templates/public-debt-payment-plan'
import { mockData } from './mockData'

@Injectable()
export class PublicDebtPaymentPlanTemplateService extends BaseTemplateApiService {
  constructor(
    private paymentScheduleApi: DefaultApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {
    super(ApplicationTypes.PUBLIC_DEBT_PAYMENT_PLAN)
  }

  paymentScheduleApiWithAuth(auth: Auth) {
    return this.paymentScheduleApi.withMiddleware(new AuthMiddleware(auth))
  }

  private getValuesFromApplication(
    application: Application,
  ): {
    email: string
    phoneNumber: string
    paymentPlans: PublicDebtPaymentPlanPayment[]
  } {
    const email = getValueViaPath(
      application.answers,
      'applicant.email',
    ) as string
    const phoneNumber = getValueViaPath(
      application.answers,
      'applicant.phoneNumber',
    ) as string

    const paymentPlanValues = getValueViaPath(
      application.answers,
      'paymentPlans',
    ) as PublicDebtPaymentPlanPaymentCollection

    const paymentPlanPayments = Object.keys(paymentPlanValues).map(
      (v) => paymentPlanValues[v],
    )

    const paymentPlanPrerequisites = getValueViaPath(
      application.externalData,
      'paymentPlanPrerequisites.data.debts',
    ) as PublicDebtPaymentPlanPrerequisites[]

    const paymentPlans = paymentPlanPayments.map((pp) => {
      const i = paymentPlanPrerequisites.findIndex((ppr) => ppr.type === pp.id)
      return {
        ...pp,
        ...paymentPlanPrerequisites[i],
      }
    })

    return { email, phoneNumber, paymentPlans }
  }

  async sendApplication({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const {
        email,
        phoneNumber,
        paymentPlans,
      } = this.getValuesFromApplication(application)

      const schedules = paymentPlans.map((plan) => {
        const distribution = JSON.parse(plan.distribution) as PaymentsDT[]
        return {
          organizationID: plan.organization,
          chargeTypes: plan.chargetypes?.map((chargeType) => ({
            chargeID: chargeType.id,
          })),
          payments: distribution.map((p) => ({
            duedate: p.dueDate,
            payment: p.payment,
            accumulated: p.accumulated,
          })),
          type: ScheduleType[plan.id],
        }
      })

      await this.paymentScheduleApiWithAuth(auth).schedulesPOST6({
        inputSchedules: {
          email: email,
          nationalId: application.applicant,
          phoneNumber: phoneNumber,
          schedules: schedules,
        },
      })
    } catch (error) {
      this.logger.error(
        'Failed to send public debt payment plan application',
        error,
      )
      throw error
    }
  }

  async paymentPlanPrerequisites({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const fakeData = getValueViaPath(application.answers, 'mock') as {
      useMockData: typeof YES | typeof NO
    }
    if (fakeData?.useMockData === YES) {
      return this.getMockData()
    }

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

    if (this.condtionsAreNotMetForApplicaiton(conditions, debts)) {
      throw new TemplateApiError(
        {
          title: errorModal.noDebts.title,
          summary: errorModal.noDebts.summary,
        },
        404,
      )
    }

    return {
      conditions,
      debts,
      allInitialSchedules,
      employer,
    }
  }

  getMockData() {
    return {
      conditions: mockData.data.conditions,
      debts: mockData.data.debts as DebtsAndSchedulesDT[],
      allInitialSchedules: mockData.data
        .allInitialSchedules as DistributionInitialPosition[],
      employer: mockData.data.employer,
    }
  }

  condtionsAreNotMetForApplicaiton(
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

  async getInitalSchedule(
    user: User,
    disposableIncome: number,
    scheduleType: string,
    totalDebtAmount: number,
  ): Promise<DistributionInitialPosition> {
    const indexOfScheduleType = Object.keys(ScheduleType).indexOf(scheduleType)
    const scheduleTypeValue = Object.values(ScheduleType)[indexOfScheduleType]

    const {
      distributionInitialPosition,
      error,
    } = await this.paymentScheduleApiWithAuth(
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

  async getConditions(auth: User): Promise<ConditionsDT> {
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

  async getDebts(auth: User): Promise<DebtsAndSchedulesDT[]> {
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
        (debt.type as unknown) as ScheduleType,
      )
      const key = Object.keys(ScheduleType)[indexOfS]
      return {
        ...debt,
        type: key,
      }
    })
  }

  async getCurrentEmployer(
    auth: User,
  ): Promise<{
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
}

import { getValueViaPath } from '@island.is/application/core'
import { Application, ApplicationTypes } from '@island.is/application/types'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  DefaultApi,
  PaymentsDT,
  ScheduleType,
} from '@island.is/clients/payment-schedule'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'

import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  PublicDebtPaymentPlanPayment,
  PublicDebtPaymentPlanPaymentCollection,
  PublicDebtPaymentPlanPrerequisites,
} from './types'
import { PrerequisitesService } from './paymentPlanPrerequisites.service'
import { TemplateApiError } from '@island.is/nest/problem'
import { error } from '@island.is/application/templates/public-debt-payment-plan'
import { PrerequisitesResult } from 'libs/application/templates/public-debt-payment-plan/src/types'

@Injectable()
export class PublicDebtPaymentPlanTemplateService extends BaseTemplateApiService {
  constructor(
    private paymentScheduleApi: DefaultApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private prerequisitesService: PrerequisitesService,
  ) {
    super(ApplicationTypes.PUBLIC_DEBT_PAYMENT_PLAN)
  }

  paymentScheduleApiWithAuth(auth: Auth) {
    return this.paymentScheduleApi.withMiddleware(new AuthMiddleware(auth))
  }

  private getValuesFromApplication(application: Application): {
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
      const { email, phoneNumber, paymentPlans } =
        this.getValuesFromApplication(application)

      const prerequisites = await this.paymentPlanPrerequisites({
        application,
        auth,
      } as TemplateApiModuleActionProps)

      console.log('**************************************************')
      console.log('application.answers')
      console.dir(application.answers, { depth: null, colors: true })
      console.log('**************************************************')
      console.log('prerequisites')
      console.dir(prerequisites.conditions, { depth: null, colors: true })
      console.log('**************************************************')
      console.log('debts')
      console.dir(prerequisites.debts, { depth: null, colors: true })
      console.log('**************************************************')
      console.log('allInitialSchedules')
      console.dir(prerequisites.allInitialSchedules, {
        depth: null,
        colors: true,
      })
      console.log('**************************************************')
      console.log('paymentPlans')
      console.dir(paymentPlans, { depth: null, colors: true })
      console.log('**************************************************')

      const schedules = paymentPlans.map((plan) => {
        const distribution = plan.distribution
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

      this.validatePaymentPlans(
        paymentPlans,
        schedules,
        prerequisites as PrerequisitesResult['data'],
      )

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
        '[public-debt-payment-plan]: Failed to send public debt payment plan application',
        error,
      )
      throw error
    }
  }

  async paymentPlanPrerequisites({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    return this.prerequisitesService.provide(application, auth)
  }

  private validatePaymentPlans(
    paymentPlans: PublicDebtPaymentPlanPayment[],
    schedules: {
      payments: { payment: number }[]
      type: ScheduleType
    }[],
    prerequisites: PrerequisitesResult['data'],
  ) {
    const { conditions, allInitialSchedules, debts } = prerequisites

    const totalPaymentPlanAmount = paymentPlans.reduce(
      (acc, plan) => acc + (plan.totalAmount || 0),
      0,
    )

    if (
      conditions.maxDebtAmount &&
      totalPaymentPlanAmount > conditions.maxDebtAmount
    ) {
      this.throwValidationError(error.maxDebtAmount)
    }

    const totalPrerequisiteDebt = debts.reduce(
      (acc: number, debt: any) => acc + (debt.totalAmount || 0),
      0,
    )

    if (
      conditions.maxDebtAmount &&
      totalPrerequisiteDebt > conditions.maxDebtAmount
    ) {
      this.throwValidationError(error.maxDebtAmount)
    }

    paymentPlans.forEach((plan) => {
      // Find the corresponding schedule for this plan
      const scheduleType = ScheduleType[plan.id]
      const schedule = schedules.find((s) => s.type === scheduleType)

      if (schedule) {
        const totalScheduled = schedule.payments.reduce(
          (sum, p) => sum + p.payment,
          0,
        )
        const totalDebt = plan.totalAmount || 0

        // Allow for small floating point differences (e.g. < 1 ISK)
        if (Math.abs(totalScheduled - totalDebt) > 1) {
          this.throwValidationError(error.totalAmountMismatch, {})
        }
      }
    })

    schedules.forEach((schedule) => {
      const initialSchedule = allInitialSchedules.find(
        (initial: any) =>
          ScheduleType[initial.scheduleType as keyof typeof ScheduleType] ===
          schedule.type,
      )

      if (schedule.payments.length > (initialSchedule?.maxCountMonth || 0)) {
        this.throwValidationError(error.maxCountMonth)
      }

      schedule.payments.forEach((p: any, index: number) => {
        if (p.payment > (initialSchedule?.maxPayment || 0)) {
          this.throwValidationError(error.maxPaymentAmount)
        }

        // Only check minPayment if it's NOT the last payment
        if (
          index !== schedule.payments.length - 1 &&
          p.payment < (initialSchedule?.minPayment || 0)
        ) {
          this.throwValidationError(error.minPaymentAmount)
        }
      })
    })
  }

  private throwValidationError(
    summary: { id: string; defaultMessage: string; description: string },
    values?: Record<string, unknown>,
    status = 400,
  ) {
    throw new TemplateApiError(
      {
        title: error.paymentplanErrorTitle,
        summary: {
          ...summary,
          values,
        },
      },
      status,
    )
  }
}

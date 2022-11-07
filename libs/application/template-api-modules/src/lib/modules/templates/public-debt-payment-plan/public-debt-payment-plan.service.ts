import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
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
import {
  PublicDebtPaymentPlanPayment,
  PublicDebtPaymentPlanPaymentCollection,
  PublicDebtPaymentPlanPrerequisites,
} from './types'

@Injectable()
export class PublicDebtPaymentPlanTemplateService {
  constructor(
    private paymentScheduleApi: DefaultApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

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
}

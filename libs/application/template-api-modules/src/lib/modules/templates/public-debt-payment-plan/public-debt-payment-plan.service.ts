import { PaymentScheduleType } from '@island.is/api/schema'
import { Application, getValueViaPath } from '@island.is/application/core'
import { DefaultApi, PaymentsDT } from '@island.is/clients/payment-schedule'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  PublicDebtPaymentPlanPayment,
  PublicDebtPaymentPlanPaymentCollection,
  PublicDebtPaymentPlanPrerequisites,
  TemplateApiModuleActionProps,
} from '../../../types'

@Injectable()
export class PublicDebtPaymentPlanTemplateService {
  constructor(
    private paymentScheduleApi: DefaultApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  private mapScheduleTypes(scheduleType: PaymentScheduleType) {
    const mapper = {
      FinesAndLegalCost: 'SR',
      OverpaidBenefits: 'OR',
      Wagedection: 'NR',
      OtherFees: 'MR',
    }

    return mapper[scheduleType]
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

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    const { email, phoneNumber, paymentPlans } = this.getValuesFromApplication(
      application,
    )

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
        type: this.mapScheduleTypes(plan.id),
      }
    })

    await this.paymentScheduleApi.schedulesPOST6({
      inputSchedules: {
        serviceInput: {
          email: email,
          nationalId: application.applicant,
          phoneNumber: phoneNumber,
          schedules: schedules,
        },
      },
    })
  }
}

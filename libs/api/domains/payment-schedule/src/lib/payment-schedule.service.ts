import { DefaultApi, ScheduleType } from '@island.is/clients/payment-schedule'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  GetInitialScheduleInput,
  GetScheduleDistributionInput,
} from './graphql/dto'
import {
  PaymentScheduleConditions,
  PaymentScheduleDebts,
  PaymentScheduleDistribution,
  PaymentScheduleEmployer,
  PaymentScheduleInitialSchedule,
} from './graphql/models'

@Injectable()
export class PaymentScheduleService {
  constructor(
    private paymentScheduleApi: DefaultApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getConditions(nationalId: string): Promise<PaymentScheduleConditions> {
    console.log('getting conditions', nationalId)
    const {
      conditions,
      error,
    } = await this.paymentScheduleApi.conditionsnationalIdGET3({
      nationalId,
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

  async getPaymentDistribution(
    nationalId: string,
    input: GetScheduleDistributionInput,
  ): Promise<PaymentScheduleDistribution> {
    const {
      paymentDistribution,
      error,
    } = await this.paymentScheduleApi.paymentDistributionnationalIdscheduleTypeGET5(
      {
        nationalId: nationalId,
        monthAmount: input.monthAmount ?? 0,
        monthCount: input.monthCount ?? 0,
        scheduleType: input.scheduleType,
        totalAmount: input.totalAmount,
      },
    )

    if (error) {
      this.logger.error('Error getting payment distribution', error)
      throw new Error('Error getting payment distribution')
    }

    if (!paymentDistribution) {
      throw new Error('No paymentDistribution not found for nationalId')
    }

    return {
      payments: paymentDistribution.payments.map((payment) => {
        return {
          dueDate: new Date(payment.dueDate),
          payment: payment.payment,
          accumulated: payment.accumulated,
        }
      }),
      scheduleType: paymentDistribution.scheduleType as ScheduleType,
      nationalId: paymentDistribution.nationalId,
    }
  }

  async getInitalSchedule(
    nationalId: string,
    input: GetInitialScheduleInput,
  ): Promise<PaymentScheduleInitialSchedule> {
    console.log('getting', input)
    const {
      distributionInitialPosition,
      error,
    } = await this.paymentScheduleApi.distributionInitialPositionnationalIdscheduleTypeGET4(
      {
        disposableIncome: input.disposableIncome,
        nationalId: nationalId,
        scheduleType: input.type,
        totalAmount: input.totalAmount,
      },
    )

    if (error) {
      this.logger.error('Error getting initial schedule', error)
      throw new Error('Error getting initial schedule')
    }
    return {
      ...distributionInitialPosition,
      scheduleType: distributionInitialPosition.scheduleType as ScheduleType,
    }
  }

  async getDebts(nationalId: string): Promise<PaymentScheduleDebts[]> {
    const {
      deptAndSchedules,
      error,
    } = await this.paymentScheduleApi.debtsandschedulesnationalIdGET2({
      nationalId,
    })
    if (error) {
      this.logger.error('Error getting debts', error)
      throw new Error('Error getting debts')
    }
    if (!deptAndSchedules) {
      throw new Error('No debts found for nationalId')
    }
    return deptAndSchedules.map((debt) => {
      return {
        ...debt,
        type: debt.type as ScheduleType,
      }
    })
  }

  async getCurrentEmployer(
    nationalId: string,
  ): Promise<PaymentScheduleEmployer> {
    const {
      wagesDeduction,
      error,
    } = await this.paymentScheduleApi.wagesdeductionnationalIdGET1({
      nationalId,
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

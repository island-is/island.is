import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { DefaultApi, ScheduleType } from '@island.is/clients/payment-schedule'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  GetInitialScheduleInput,
  GetScheduleDistributionInput,
} from './graphql/dto'
import { UpdateCurrentEmployerInput } from './graphql/dto/updateCurrentEmployerInput'
import {
  PaymentScheduleCompanyConditions,
  PaymentScheduleConditions,
  PaymentScheduleDebts,
  PaymentScheduleDistribution,
  PaymentScheduleEmployer,
  PaymentScheduleInitialSchedule,
} from './graphql/models'
import { UpdateCurrentEmployerResponse } from './graphql/models/updateCurrentEmployer.model'

@Injectable()
export class PaymentScheduleService {
  constructor(
    private paymentScheduleApi: DefaultApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  paymentScheduleApiWithAuth(auth: Auth) {
    return this.paymentScheduleApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getConditions(user: User): Promise<PaymentScheduleConditions> {
    const { conditions, error } = await this.paymentScheduleApiWithAuth(
      user,
    ).conditionsnationalIdGET3({
      nationalId: user.nationalId,
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

  async getCompanyConditions(
    user: User,
  ): Promise<PaymentScheduleCompanyConditions> {
    const { conditions, error } = await this.paymentScheduleApiWithAuth(
      user,
    ).companyConditionsnationalIdGET8({
      nationalId: user.nationalId,
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

  async getPaymentDistribution(
    user: User,
    input: GetScheduleDistributionInput,
  ): Promise<PaymentScheduleDistribution> {
    const { paymentDistribution, error } =
      await this.paymentScheduleApiWithAuth(
        user,
      ).paymentDistributionnationalIdscheduleTypeGET5({
        nationalId: user.nationalId,
        monthAmount: input.monthAmount ?? 0,
        monthCount: input.monthCount ?? 0,
        scheduleType: input.scheduleType,
        totalAmount: input.totalAmount,
      })

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

  /**
   * Checks if the user is allowed to select specific company as his employer
   * - returns boolean, true if allowed, false if not
   * - FJS-Public/paymentSchedule_v1/employerValid/{usernationalid}/{employernationalid}
   * @typedef {{user: User, nationalId: string}}
   * @private
   */
  async isEmployerValid(user: User, nationalId: string): Promise<boolean> {
    const { employerValid, error } = await this.paymentScheduleApiWithAuth(
      user,
    ).employerValidnationalIdemployerNationalIdGET7({
      nationalId: user.nationalId,
      employerNationalId: nationalId,
    })
    if (error) {
      this.logger.error('Error employer information for nationalId', error)
      throw new Error('Error employer information for nationalId')
    }

    if (!employerValid) {
      return false
    }

    return employerValid.isEmployerValid === 'TRUE'
  }

  async getInitalSchedule(
    user: User,
    input: GetInitialScheduleInput,
  ): Promise<PaymentScheduleInitialSchedule> {
    const { distributionInitialPosition, error } =
      await this.paymentScheduleApiWithAuth(
        user,
      ).distributionInitialPositionnationalIdscheduleTypeGET4({
        disposableIncome: input.disposableIncome,
        nationalId: user.nationalId,
        scheduleType: input.type,
        totalAmount: input.totalAmount,
      })

    if (error) {
      this.logger.error('Error getting initial schedule', error)
      throw new Error('Error getting initial schedule')
    }
    return {
      ...distributionInitialPosition,
      scheduleType: distributionInitialPosition.scheduleType as ScheduleType,
    }
  }

  async getDebts(user: User): Promise<PaymentScheduleDebts[]> {
    const { deptAndSchedules, error } = await this.paymentScheduleApiWithAuth(
      user,
    ).debtsandschedulesnationalIdGET2({
      nationalId: user.nationalId,
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

  async getCurrentEmployer(user: User): Promise<PaymentScheduleEmployer> {
    const { wagesDeduction, error } = await this.paymentScheduleApiWithAuth(
      user,
    ).wagesdeductionnationalIdGET1({
      nationalId: user.nationalId,
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

  async updateCurrentEmployer(
    user: User,
    input: UpdateCurrentEmployerInput,
  ): Promise<UpdateCurrentEmployerResponse> {
    try {
      await this.paymentScheduleApiWithAuth(
        user,
      ).wagesdeductionnationalIdPUT1Raw({
        input: { employer: { employerNationalId: input.employerNationalId } },
        nationalId: user.nationalId,
      })
    } catch (error) {
      this.logger.error('Error occurred when updating current employer', error)
      throw new Error('Error occurred when updating current employer')
    }

    return { success: true }
  }
}

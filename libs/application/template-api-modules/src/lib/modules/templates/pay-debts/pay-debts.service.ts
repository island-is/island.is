import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { FinanceClientV3Service } from '@island.is/clients/finance-v3'
import { DownloadServiceConfig } from '@island.is/nest/config'
import { AuditService } from '@island.is/nest/audit'
import { TemplateApiModuleActionProps } from '../../../types'
import { PaymentService } from '@island.is/application/api/payment'
import {
  getDebtPaymentItems,
  paymentMessages,
} from '@island.is/application/templates/pay-debts'
import { TemplateApiError } from '@island.is/nest/problem'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

const { noSelection } = paymentMessages

@Injectable()
export class PayDebtsService extends BaseTemplateApiService {
  constructor(
    private readonly financeClientV3Service: FinanceClientV3Service,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
    private readonly auditService: AuditService,
    private readonly paymentService: PaymentService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    super(ApplicationTypes.PAY_DEBTS)
  }

  async createDebtPayment({
    application,
    auth,
    currentUserLocale,
  }: TemplateApiModuleActionProps) {
    const debts = getDebtPaymentItems(application)

    if (debts.length === 0) {
      throw new TemplateApiError(
        { title: noSelection.title, summary: noSelection.message },
        400,
      )
    }

    return this.paymentService.createDebtPayment(
      auth,
      application.id,
      debts,
      currentUserLocale,
    )
  }

  async deleteDebtPayment({ application, auth }: TemplateApiModuleActionProps) {
    await this.paymentService.deleteDebtPayment(application.id, auth)
  }

  async getCustomerDebts({ auth, application }: TemplateApiModuleActionProps) {
    const [result, payrollDeduction] = await Promise.all([
      this.financeClientV3Service.getCustomerDebts(auth, {
        nationalID: auth.nationalId,
      }),
      this.financeClientV3Service
        .getPayrollDeduction(auth, { nationalID: auth.nationalId })
        .catch((error) => {
          this.logger.warn('FJS payroll deduction lookup failed', { error })
          return null
        }),
    ])
    const deductibleChargeTypeIds = new Set(payrollDeduction?.chargeTypeId)

    this.auditService.audit({
      auth,
      action: 'getCustomerDebts',
      resources: application.id,
      meta: { debtCount: result?.debts?.length ?? 0 },
    })

    return {
      message: result?.message ?? '',
      timestamp: result?.timestamp ?? '',
      downloadServiceURL: `${this.downloadServiceConfig.baseUrl}/download/v1/finance/`,
      debts: (result?.debts ?? []).map((debt) => ({
        chargeTypeId: debt.chargeTypeId,
        chargeTypeName: debt.chargeTypeName,
        chargeItemSubject: debt.chargeItemSubject,
        timePeriod: debt.timePeriod,
        dueDate: debt.dueDate,
        finalDueDate: debt.finalDueDate,
        principal: Number(debt.principal),
        interest: Number(debt.interest),
        cost: Number(debt.cost),
        debts: Number(debt.debts),
        payID: debt.payID,
        documentID: debt.documentID,
        salaryPayerName: deductibleChargeTypeIds.has(debt.chargeTypeId)
          ? payrollDeduction?.name
          : undefined,
      })),
    }
  }
}

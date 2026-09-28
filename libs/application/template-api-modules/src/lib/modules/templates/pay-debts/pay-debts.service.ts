import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { FinanceClientV3Service } from '@island.is/clients/finance-v3'
import { DownloadServiceConfig } from '@island.is/nest/config'
import { TemplateApiModuleActionProps } from '../../../types'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

// TODO: Remove the salary payer mock once FJS returns launagreiðandi on the
// debt response; `salaryPayerName` should then come straight from `debt`.
const MOCK_SALARY_PAYER_NAME = 'Mocklaunagreiðandi ehf.'

const mockSalaryPayerName = (index: number) =>
  (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) &&
  index % 2 === 0
    ? MOCK_SALARY_PAYER_NAME
    : undefined

@Injectable()
export class PayDebtsService extends BaseTemplateApiService {
  constructor(
    private readonly financeClientV3Service: FinanceClientV3Service,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {
    super(ApplicationTypes.PAY_DEBTS)
  }

  async getCustomerDebts({ auth }: TemplateApiModuleActionProps) {
    const result = await this.financeClientV3Service.getCustomerDebts(auth, {
      nationalID: auth.nationalId,
    })

    return {
      message: result?.message ?? '',
      timestamp: result?.timestamp ?? '',
      downloadServiceURL: `${this.downloadServiceConfig.baseUrl}/download/v1/finance/`,
      debts: (result?.debts ?? []).map((debt, index) => ({
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
        salaryPayerName: mockSalaryPayerName(index),
      })),
    }
  }
}

import { Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { FinanceClientV3Service } from '@island.is/clients/finance-v3'
import { TemplateApiModuleActionProps } from '../../../types'

@Injectable()
export class PayDebtsService extends BaseTemplateApiService {
  constructor(
    private readonly financeClientV3Service: FinanceClientV3Service,
  ) {
    super(ApplicationTypes.PAY_DEBTS)
  }

  async getCustomerDebts({
    auth,
    params,
  }: TemplateApiModuleActionProps<{ nextKey?: string }>) {
    const result = await this.financeClientV3Service.getCustomerDebts(auth, {
      nationalID: auth.nationalId,
      nextKey: params?.nextKey,
    })

    return {
      message: result?.message ?? '',
      timestamp: result?.timestamp ?? '',
      nextkey: result?.nextkey ?? '',
      debts: (result?.debts ?? []).map((debt) => ({
        chargeTypeId: debt.chargeTypeId,
        chargeTypeName: debt.chargeTypeName,
        chargeItemSubject: debt.chargeItemSubject,
        timePeriod: debt.timePeriod,
        dueDate: debt.dueDate,
        finalDueDate: debt.finalDueDate,
        debts: Number(debt.debts),
        payID: debt.payID,
      })),
    }
  }
}

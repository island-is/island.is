import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { Prerequisites } from './tempAPITypes'

const createPrerequisitesResponse = (): Prerequisites => {
  return {
    maxDebt: 2000000,
    totalDebt: 500000,
    disposableIncome: 300000,
    alimony: 0,
    minimumPayment: 30000,
    maxDebtOk: true,
    maxDebtText: 'Max debt was not OK :(',
    taxesOk: true,
    taxesText: 'Taxes was not OK :(',
    taxReturnsOk: true,
    taxReturnsText: 'Tax returns was not OK :(',
    vatOk: true,
    vatText: 'VAT was not OK :(',
    citOk: true,
    citText: 'CIT was not OK :(',
    accommodationTaxOk: true,
    accommodationTaxText: 'Accommodation tax was not OK :(',
    withholdingTaxOk: true,
    withholdingTaxText: 'Witholding tax was not OK :(',
    wageReturnsOk: true,
    wageReturnsText: 'Wage returns was not OK :(',
  }
}

// TODO: connect to API
export class PaymentPlanPrerequisites extends BasicDataProvider {
  type = 'PaymentPlanPrerequisites'
  provide(): Promise<Prerequisites> {
    return Promise.resolve(createPrerequisitesResponse())
  }

  onProvideSuccess(prerequisites: Prerequisites): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: prerequisites,
      status: 'success',
    }
  }

  onProvideError(): FailedDataProviderResult {
    return {
      date: new Date(),
      data: {},
      reason: 'Failed',
      status: 'failure',
    }
  }
}

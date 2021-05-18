import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { Payment } from './tempAPITypes'

export const createPaymentsResponse = (): Payment[] => [
  {
    id: '123',
    ssn: '0123456789',
    type: 'S',
    paymentSchedule: 'Sektir og sakarkostnaður',
    organization: 'Skatturinn',
    totalAmount: 50000,
  },
  {
    id: '321',
    ssn: '9876542310',
    type: 'O',
    paymentSchedule: 'Ofgreiddar bætur',
    organization: 'Skatturinn',
    totalAmount: 30000,
  },
  {
    id: '222',
    ssn: '6549873210',
    type: 'N',
    paymentSchedule: 'Launaafdráttur',
    organization: 'Sýslumaðurinn á Norðurlandi vestra',
    totalAmount: 100000,
  },
]

// TODO: connect to API
export class PaymentPlanList extends BasicDataProvider {
  type = 'PaymentPlanList'
  provide(): Promise<Payment[]> {
    return Promise.resolve(createPaymentsResponse())
  }

  onProvideSuccess(payments: Payment[]): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: payments,
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

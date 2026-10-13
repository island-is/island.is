import { withAuthContext } from '@island.is/auth-nest-tools'
import {
  customerDebtsnationalIdGet2,
  customerRecordsnationalIdGet1,
  payDebtPost3,
  validatePaymentPost4,
} from '../../gen/fetch'
import {
  FinanceClientV3ResultMissingError,
  FinanceClientV3Service,
} from './financeV3.service'

jest.mock('../../gen/fetch', () => ({
  customerRecordsnationalIdGet1: jest.fn(),
  customerDebtsnationalIdGet2: jest.fn(),
  payDebtPost3: jest.fn(),
  validatePaymentPost4: jest.fn(),
}))

jest.mock('@island.is/auth-nest-tools', () => ({
  withAuthContext: jest.fn((_user, fn) => fn()),
}))

// Mocked to keep ts-jest from type-checking the middlewares lib under this
// lib's stricter compiler options.
jest.mock('@island.is/clients/middlewares', () => {
  const data = (promise: Promise<{ data: unknown }>) =>
    promise.then((response) => response.data)
  return { data, dataOr404Null: data }
})

const getDebts = customerDebtsnationalIdGet2 as jest.Mock
const payDebt = payDebtPost3 as jest.Mock
const validatePayment = validatePaymentPost4 as jest.Mock

const debtInput = {
  payFlowId: 'flow-1',
  nationalId: '0101302989',
  totalAmount: 15000,
  paymentDate: '2026-10-12',
  payDebts: [
    { payid: 'pay-1', payAmount: 10000 },
    { payid: 'pay-2', payAmount: 5000 },
  ],
}

describe('FinanceClientV3Service', () => {
  const service = new FinanceClientV3Service()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCustomerRecords', () => {
    it('runs in the user auth context so the token is exchanged', async () => {
      const user = { nationalId: '0101302989' } as never
      ;(customerRecordsnationalIdGet1 as jest.Mock).mockResolvedValue({
        data: { resultCustomerRecords: { more: false, pagesize: 0 } },
      })

      await expect(
        service.getCustomerRecords(user, {
          nationalID: '0101302989',
          dayFrom: '2026-01-01',
          dayTo: '2026-10-12',
          chargeTypeID: ['AB'],
        }),
      ).resolves.toEqual({ more: false, pagesize: 0 })

      expect(withAuthContext).toHaveBeenCalledWith(user, expect.any(Function))
    })
  })

  describe('getCustomerDebts', () => {
    it('runs in the user auth context and returns the debts result', async () => {
      const user = { nationalId: '0101302989' } as never
      const result = {
        message: '',
        timestamp: '',
        nextkey: '',
        debts: [],
      }
      getDebts.mockResolvedValue({ data: { customerDebtsResult: result } })

      await expect(
        service.getCustomerDebts(user, { nationalID: '0101302989' }),
      ).resolves.toEqual(result)

      expect(withAuthContext).toHaveBeenCalledWith(user, expect.any(Function))
      expect(getDebts).toHaveBeenCalledWith({
        path: { nationalID: '0101302989' },
        query: { nextKey: undefined },
      })
    })
  })

  describe('validatePayment', () => {
    it('sends the input and returns the validation result', async () => {
      validatePayment.mockResolvedValue({
        data: { validatePaymentResult: { paymentOptions: 'CARD;TRANSFER' } },
      })

      await expect(service.validatePayment(debtInput)).resolves.toEqual({
        paymentOptions: 'CARD;TRANSFER',
      })
      expect(validatePayment).toHaveBeenCalledWith({ body: debtInput })
      expect(withAuthContext).not.toHaveBeenCalled()
    })

    it('throws with the problem details when the result is missing', async () => {
      const problem = { title: 'Invalid', status: '400', detail: 'Nope' }
      validatePayment.mockResolvedValue({ data: { error: problem } })

      const error = await service
        .validatePayment(debtInput)
        .catch((e: unknown) => e)

      expect(error).toBeInstanceOf(FinanceClientV3ResultMissingError)
      expect((error as FinanceClientV3ResultMissingError).problem).toEqual(
        problem,
      )
    })

    it('propagates fetch errors', async () => {
      const fetchError = Object.assign(new Error('Request failed'), {
        name: 'FetchError',
        status: 400,
      })
      validatePayment.mockRejectedValue(fetchError)

      await expect(service.validatePayment(debtInput)).rejects.toBe(fetchError)
    })
  })

  describe('payDebt', () => {
    const payInput = {
      ...debtInput,
      payInfo: {
        RRN: 'rrn-1',
        paymentMeans: 'KreditCard' as const,
        payableAmount: 15000,
      },
    }

    it('sends the input and returns the registration result', async () => {
      const result = { payFlowId: 'flow-1', dateCreated: '2026-10-12' }
      payDebt.mockResolvedValue({ data: { payDebtsResult: result } })

      await expect(service.payDebt(payInput)).resolves.toEqual(result)
      expect(payDebt).toHaveBeenCalledWith({ body: payInput })
      expect(withAuthContext).not.toHaveBeenCalled()
    })

    it('aborts the call after the given timeout', async () => {
      const result = { payFlowId: 'flow-1', dateCreated: '2026-10-12' }
      payDebt.mockResolvedValue({ data: { payDebtsResult: result } })

      await service.payDebt(payInput, { timeoutMs: 15000 })

      expect(payDebt).toHaveBeenCalledWith({
        body: payInput,
        signal: expect.any(AbortSignal),
      })
    })

    it('throws when the result is missing', async () => {
      payDebt.mockResolvedValue({ data: {} })

      await expect(service.payDebt(payInput)).rejects.toBeInstanceOf(
        FinanceClientV3ResultMissingError,
      )
    })
  })
})

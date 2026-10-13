import {
  FinanceClientV3ResultMissingError,
  FinanceClientV3Service,
} from '@island.is/clients/finance-v3'
import type { ProblemDetailsDt } from '@island.is/clients/finance-v3'
import { FetchError } from '@island.is/clients/middlewares'

import { PaymentMethod } from '../../types'
import { DebtFjsService } from './debtFjs.service'

const problem: ProblemDetailsDt = {
  title: 'Bad request',
  status: '400',
  detail: 'Amount exceeds debt',
}

const fetchError = (status: number) => fjsFetchError(status, { error: problem })

const circuitBreakerError = () =>
  Object.assign(new Error('Breaker is open'), { code: 'EOPENBREAKER' })
const networkError = () =>
  Object.assign(new Error('read ECONNRESET'), { code: 'ECONNRESET' })
const timeoutError = () => new Error('Timeout of 20000ms exceeded')

// Builds the error the FJS client throws for a non-2xx response
const fjsFetchError = (status: number, body: object) =>
  FetchError.build(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json' },
    }) as never,
    true,
  )

const validateInput = {
  flowId: '11111111-1111-4111-8111-111111111111',
  payerNationalId: '0101302989',
  debts: [
    { payId: 'pay-1', amount: 10000 },
    { payId: 'pay-2', amount: 5000 },
  ],
  paymentDate: new Date(2026, 9, 12),
}

// What FJS answers for a payFlowId it already took a payment for
const alreadyReceived: ProblemDetailsDt = {
  title: '6',
  status: '400',
  detail: `Búið að taka á móti álagningu ${validateInput.flowId}`,
}

const payInfo = {
  RRN: '123',
  paymentMeans: 'DebetCard' as const,
  payableAmount: 15000,
}

describe('DebtFjsService', () => {
  let financeClient: {
    validatePayment: jest.Mock
    payDebt: jest.Mock
  }
  let logger: { warn: jest.Mock; error: jest.Mock; info: jest.Mock }
  let service: DebtFjsService

  beforeEach(() => {
    financeClient = { validatePayment: jest.fn(), payDebt: jest.fn() }
    logger = { warn: jest.fn(), error: jest.fn(), info: jest.fn() }
    service = new DebtFjsService(
      financeClient as unknown as FinanceClientV3Service,
      logger as never,
    )
  })

  describe('validate', () => {
    it('sends the flow id, total and formatted date', async () => {
      financeClient.validatePayment.mockResolvedValue({
        paymentOptions: 'CARD;TRANSFER',
      })

      await service.validate(validateInput)

      expect(financeClient.validatePayment).toHaveBeenCalledWith({
        payFlowId: validateInput.flowId,
        nationalId: '0101302989',
        totalAmount: 15000,
        paymentDate: '2026-10-12',
        payDebts: [
          { payid: 'pay-1', payAmount: 10000 },
          { payid: 'pay-2', payAmount: 5000 },
        ],
      })
    })

    it('is valid with the parsed payment options', async () => {
      financeClient.validatePayment.mockResolvedValue({
        paymentOptions: 'CARD;TRANSFER',
      })

      await expect(service.validate(validateInput)).resolves.toEqual({
        type: 'valid',
        paymentOptions: new Set([
          PaymentMethod.CARD,
          PaymentMethod.BANK_TRANSFER,
        ]),
        rawPaymentOptions: 'CARD;TRANSFER',
      })
    })

    it('logs unknown payment option tokens', async () => {
      financeClient.validatePayment.mockResolvedValue({
        paymentOptions: 'CARD;BITCOIN',
      })

      const outcome = await service.validate(validateInput)

      expect(outcome).toMatchObject({
        type: 'valid',
        paymentOptions: new Set([PaymentMethod.CARD]),
      })
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Unknown FJS debt payment option'),
        { token: 'BITCOIN' },
      )
    })

    it('is invalid with the problem on a 400', async () => {
      financeClient.validatePayment.mockRejectedValue(await fetchError(400))

      await expect(service.validate(validateInput)).resolves.toEqual({
        type: 'invalid',
        problem,
      })
    })

    it('is already registered when FJS has a payment for the flow id', async () => {
      financeClient.validatePayment.mockRejectedValue(
        await fjsFetchError(400, { error: alreadyReceived }),
      )

      await expect(service.validate(validateInput)).resolves.toEqual({
        type: 'already_registered',
        problem: alreadyReceived,
      })
    })

    it.each([401, 403, 500, 502, 503])(
      'is transient on a %s',
      async (status) => {
        const error = await fetchError(status)
        financeClient.validatePayment.mockRejectedValue(error)

        await expect(service.validate(validateInput)).resolves.toEqual({
          type: 'transient',
          error,
        })
      },
    )

    it.each([
      ['a network error', networkError()],
      ['a timeout', timeoutError()],
      ['an open circuit breaker', circuitBreakerError()],
      [
        'a missing result',
        new FinanceClientV3ResultMissingError('validatePayment'),
      ],
    ])('is transient on %s', async (_name, error) => {
      financeClient.validatePayment.mockRejectedValue(error)

      await expect(service.validate(validateInput)).resolves.toEqual({
        type: 'transient',
        error,
      })
    })
  })

  describe('pay', () => {
    const payInput = { ...validateInput, payInfo }

    it('sends payInfo along with the debts', async () => {
      financeClient.payDebt.mockResolvedValue({
        payFlowId: validateInput.flowId,
        dateCreated: '2026-10-12T10:00:00',
      })

      await service.pay(payInput)

      expect(financeClient.payDebt).toHaveBeenCalledWith({
        payFlowId: validateInput.flowId,
        nationalId: '0101302989',
        totalAmount: 15000,
        paymentDate: '2026-10-12',
        payDebts: [
          { payid: 'pay-1', payAmount: 10000 },
          { payid: 'pay-2', payAmount: 5000 },
        ],
        payInfo,
      })
    })

    it('passes the timeout on to the client', async () => {
      financeClient.payDebt.mockResolvedValue({
        payFlowId: validateInput.flowId,
        dateCreated: '2026-10-12T10:00:00',
      })

      await service.pay({ ...payInput, timeoutMs: 15000 })

      expect(financeClient.payDebt).toHaveBeenCalledWith(
        expect.objectContaining({ payFlowId: validateInput.flowId }),
        { timeoutMs: 15000 },
      )
    })

    it('is registered on success', async () => {
      financeClient.payDebt.mockResolvedValue({
        payFlowId: validateInput.flowId,
        dateCreated: '2026-10-12T10:00:00',
      })

      await expect(service.pay(payInput)).resolves.toEqual({
        type: 'registered',
        payFlowId: validateInput.flowId,
        dateCreated: '2026-10-12T10:00:00',
      })
    })

    it('is rejected with the problem on a 400', async () => {
      financeClient.payDebt.mockRejectedValue(await fetchError(400))

      await expect(service.pay(payInput)).resolves.toEqual({
        type: 'rejected',
        problem,
      })
    })

    it('is already registered when FJS has a payment for the flow id', async () => {
      financeClient.payDebt.mockRejectedValue(
        await fjsFetchError(400, { error: alreadyReceived }),
      )

      await expect(service.pay(payInput)).resolves.toEqual({
        type: 'already_registered',
        problem: alreadyReceived,
      })
    })

    it.each([401, 403])('is transient on a %s', async (status) => {
      const error = await fetchError(status)
      financeClient.payDebt.mockRejectedValue(error)

      await expect(service.pay(payInput)).resolves.toEqual({
        type: 'transient',
        error,
      })
    })

    it.each([500, 502, 503, 504])('is ambiguous on a %s', async (status) => {
      const error = await fetchError(status)
      financeClient.payDebt.mockRejectedValue(error)

      await expect(service.pay(payInput)).resolves.toEqual({
        type: 'ambiguous',
        error,
      })
    })

    it.each([
      ['a network error', networkError()],
      ['a timeout', timeoutError()],
      ['an open circuit breaker', circuitBreakerError()],
      ['a missing result', new FinanceClientV3ResultMissingError('payDebt')],
    ])('is ambiguous on %s', async (_name, error) => {
      financeClient.payDebt.mockRejectedValue(error)

      await expect(service.pay(payInput)).resolves.toEqual({
        type: 'ambiguous',
        error,
      })
    })
  })
})

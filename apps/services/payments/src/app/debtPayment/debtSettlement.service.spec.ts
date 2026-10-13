import { getModelToken } from '@nestjs/sequelize'

import { TestApp } from '@island.is/testing/nest'

import { setupTestApp } from '../../../test/setup'
import {
  FJS_DEBT_ORGANISATION_ID,
  FjsPayInfo,
} from '../../utils/fjsDebtPayment'
import { FjsDebtPayment } from '../paymentFlow/models/fjsDebtPayment.model'
import { PaymentFlow } from '../paymentFlow/models/paymentFlow.model'
import { PaymentFlowEvent } from '../paymentFlow/models/paymentFlowEvent.model'
import { DebtFjsService } from './debtFjs.service'
import { DebtSettlementService } from './debtSettlement.service'

const problem = {
  title: 'Bad request',
  status: '400',
  detail: 'Amount exceeds debt',
}

// FJS already took a payment with this payFlowId
const alreadyRegistered = {
  type: 'already_registered' as const,
  problem: {
    type: '6',
    title: 'Bad Request',
    status: '400',
    detail: 'Búið að taka á móti álagningu flow',
  },
}

const payInfo: FjsPayInfo = {
  kind: 'credit',
  RRN: 'rrn-1',
  PAN: '****1234',
  authCode: 'auth-1',
  cardType: 'Visa',
  payableAmount: 15000,
  correlationId: 'correlation-1',
}

const debts = [
  { payId: 'pay-1', amount: 10000 },
  { payId: 'pay-2', amount: 5000 },
]

const registered = {
  type: 'registered' as const,
  dateCreated: '2026-10-12T10:00:00',
}

describe('DebtSettlementService', () => {
  let app: TestApp
  let service: DebtSettlementService
  let paymentFlowModel: typeof PaymentFlow
  let fjsDebtPaymentModel: typeof FjsDebtPayment
  let paymentFlowEventModel: typeof PaymentFlowEvent
  let validate: jest.SpyInstance
  let pay: jest.SpyInstance

  beforeAll(async () => {
    app = await setupTestApp()
    service = app.get(DebtSettlementService)
    paymentFlowModel = app.get(getModelToken(PaymentFlow))
    fjsDebtPaymentModel = app.get(getModelToken(FjsDebtPayment))
    paymentFlowEventModel = app.get(getModelToken(PaymentFlowEvent))

    const debtFjsService = app.get(DebtFjsService)
    validate = jest.spyOn(debtFjsService, 'validate')
    pay = jest.spyOn(debtFjsService, 'pay')
  })

  beforeEach(() => {
    validate.mockReset()
    pay.mockReset().mockResolvedValue(registered)
  })

  afterAll(() => {
    app?.cleanUp()
    jest.restoreAllMocks()
  })

  const createFlow = async () => {
    const paymentFlow = await paymentFlowModel.create({
      payerNationalId: '0101302989',
      availablePaymentMethods: ['card'],
      onUpdateUrl: 'https://www.island.is/greida/update',
      organisationId: FJS_DEBT_ORGANISATION_ID,
      type: 'debt',
    } as never)

    return { id: paymentFlow.id, payerNationalId: '0101302989', debts }
  }

  const getRow = (paymentFlowId: string) =>
    fjsDebtPaymentModel.findOne({ where: { paymentFlowId } })

  /** Makes the last attempt look old enough for the next one to be claimed. */
  const ageLastAttempt = (paymentFlowId: string) =>
    fjsDebtPaymentModel.update(
      { lastAttemptAt: new Date(Date.now() - 5 * 60 * 1000) },
      { where: { paymentFlowId } },
    )

  const getEvents = (paymentFlowId: string) =>
    paymentFlowEventModel.findAll({ where: { paymentFlowId } })

  it('registers the payment', async () => {
    const flow = await createFlow()

    const outcome = await service.attempt(flow, payInfo)

    expect(outcome).toEqual({ ...registered, alreadySettled: false })
    expect(pay).toHaveBeenCalledTimes(1)
    expect(pay).toHaveBeenCalledWith({
      flowId: flow.id,
      payerNationalId: flow.payerNationalId,
      debts,
      paymentDate: expect.any(Date),
      // The neutral payInfo, mapped to what FJS expects
      payInfo: {
        RRN: 'rrn-1',
        PAN: '****1234',
        authCode: 'auth-1',
        cardType: 'Visa',
        payableAmount: 15000,
        correlationId: 'correlation-1',
        paymentMeans: 'KreditCard',
      },
      timeoutMs: 15000,
    })

    const row = await getRow(flow.id)
    expect(row).toMatchObject({
      status: 'registered',
      attempts: 1,
      hadAmbiguousAttempt: false,
      amount: 15000,
      dateCreated: registered.dateCreated,
    })
    expect(row?.paymentDate).toBeInstanceOf(Date)
    expect(row?.lastAttemptAt).toBeInstanceOf(Date)
  })

  it('pays without validating again, payDebt answers with the same errors', async () => {
    const flow = await createFlow()

    await service.attempt(flow, payInfo)

    expect(validate).not.toHaveBeenCalled()
    expect(pay).toHaveBeenCalledTimes(1)
  })

  it('rejects when FJS answers 400 on a first attempt', async () => {
    pay.mockResolvedValue({ type: 'rejected', problem })
    const flow = await createFlow()

    const outcome = await service.attempt(flow, payInfo)

    expect(outcome).toEqual({
      type: 'rejected',
      problem,
      alreadySettled: false,
    })
    expect(await getRow(flow.id)).toMatchObject({
      status: 'rejected',
      lastError: problem,
    })
    // The caller reports it, no event is written here
    expect(await getEvents(flow.id)).toHaveLength(0)
  })

  it('defers an ambiguous outcome and remembers it', async () => {
    pay.mockResolvedValue({ type: 'ambiguous', error: new Error('Timeout') })
    const flow = await createFlow()

    const outcome = await service.attempt(flow, payInfo)

    expect(outcome).toEqual({ type: 'deferred', reason: 'ambiguous' })
    expect(await getRow(flow.id)).toMatchObject({
      status: 'pending',
      hadAmbiguousAttempt: true,
      attempts: 1,
      lastError: expect.objectContaining({ message: 'Timeout' }),
    })
  })

  it('defers a transient outcome without flagging the attempt', async () => {
    pay.mockResolvedValue({ type: 'transient', error: new Error('401') })
    const flow = await createFlow()

    const outcome = await service.attempt(flow, payInfo)

    expect(outcome).toEqual({ type: 'deferred', reason: 'transient' })
    expect(await getRow(flow.id)).toMatchObject({
      status: 'pending',
      hadAmbiguousAttempt: false,
      lastError: expect.objectContaining({ message: '401' }),
    })
  })

  it('needs reconciliation, not a refund, when FJS has the payment on a first attempt', async () => {
    pay.mockResolvedValue(alreadyRegistered)
    const flow = await createFlow()

    const outcome = await service.attempt(flow, payInfo)

    expect(outcome).toEqual({
      type: 'reconcile',
      problem: alreadyRegistered.problem,
      alreadySettled: false,
    })
    expect((await getRow(flow.id))?.status).toBe('needs_reconciliation')
  })

  describe('after an ambiguous attempt', () => {
    const createFlowWithAmbiguousAttempt = async () => {
      pay.mockResolvedValueOnce({
        type: 'ambiguous',
        error: new Error('Timeout'),
      })
      const flow = await createFlow()
      await service.attempt(flow, payInfo)
      await ageLastAttempt(flow.id)
      return flow
    }

    it('registers on a retry that succeeds', async () => {
      const flow = await createFlowWithAmbiguousAttempt()

      const outcome = await service.attempt(flow, payInfo)

      expect(outcome).toMatchObject({ type: 'registered' })
      expect(await getRow(flow.id)).toMatchObject({
        status: 'registered',
        attempts: 2,
        hadAmbiguousAttempt: true,
      })
    })

    it('needs reconciliation, not a refund, when the retry is rejected', async () => {
      const flow = await createFlowWithAmbiguousAttempt()
      pay.mockResolvedValue({ type: 'rejected', problem })

      const outcome = await service.attempt(flow, payInfo)

      expect(outcome).toEqual({
        type: 'reconcile',
        problem,
        alreadySettled: false,
      })
      expect((await getRow(flow.id))?.status).toBe('needs_reconciliation')

      // A durable event for ops, and nothing that could reach the organisation
      const events = await getEvents(flow.id)
      expect(events).toHaveLength(1)
      expect(events[0]).toMatchObject({
        type: 'error',
        reason: 'other',
        paymentMethod: 'system',
        metadata: { needsReconciliation: true, problem },
      })
    })

    it('registers when the retry is a duplicate of it', async () => {
      const flow = await createFlowWithAmbiguousAttempt()
      pay.mockResolvedValue(alreadyRegistered)

      const outcome = await service.attempt(flow, payInfo)

      expect(outcome).toEqual({
        type: 'registered',
        alreadySettled: false,
      })

      const row = await getRow(flow.id)
      expect(row).toMatchObject({
        status: 'registered',
        attempts: 2,
        hadAmbiguousAttempt: true,
      })
      // FJS does not repeat it for a duplicate
      expect(row?.dateCreated).toBeNull()
      // Not a reconciliation, so no event either
      expect(await getEvents(flow.id)).toHaveLength(0)
    })
  })

  describe('when the outcome of a call is lost', () => {
    // E.g. the process dies, or the state write fails, after FJS accepted the payment
    const createFlowWithLostOutcome = async () => {
      pay.mockRejectedValueOnce(new Error('Process died mid-call'))
      const flow = await createFlow()
      await expect(service.attempt(flow, payInfo)).rejects.toThrow()
      await ageLastAttempt(flow.id)
      return flow
    }

    it('marks the call as ambiguous before calling FJS', async () => {
      const flow = await createFlowWithLostOutcome()

      expect(await getRow(flow.id)).toMatchObject({
        status: 'pending',
        hadAmbiguousAttempt: true,
      })
    })

    it('needs reconciliation, not a refund, when a retry is rejected', async () => {
      const flow = await createFlowWithLostOutcome()
      pay.mockResolvedValue({ type: 'rejected', problem })

      const outcome = await service.attempt(flow, payInfo)

      expect(outcome).toMatchObject({ type: 'reconcile' })
      expect((await getRow(flow.id))?.status).toBe('needs_reconciliation')
    })

    it('registers when a retry finds that FJS has the payment', async () => {
      const flow = await createFlowWithLostOutcome()
      pay.mockResolvedValue(alreadyRegistered)

      const outcome = await service.attempt(flow, payInfo)

      expect(outcome).toMatchObject({
        type: 'registered',
        alreadySettled: false,
      })
      expect((await getRow(flow.id))?.status).toBe('registered')
    })
  })

  describe('a row that is settled', () => {
    it.each([
      ['registered', 'registered'],
      ['rejected', 'rejected'],
      ['needs_reconciliation', 'reconcile'],
    ] as const)('is final once %s', async (status, type) => {
      const flow = await createFlow()
      await fjsDebtPaymentModel.create({
        paymentFlowId: flow.id,
        amount: 15000,
        status,
        dateCreated: '2026-10-12T10:00:00',
        lastError: problem,
      })

      const outcome = await service.attempt(flow, payInfo)

      expect(outcome).toMatchObject({ type, alreadySettled: true })
      expect(validate).not.toHaveBeenCalled()
      expect(pay).not.toHaveBeenCalled()
      expect((await getRow(flow.id))?.attempts).toBe(0)
    })
  })

  describe('claiming an attempt', () => {
    it('does not start a second attempt while one is in flight', async () => {
      let finishPay: (value: unknown) => void = () => undefined
      pay.mockReturnValue(new Promise((resolve) => (finishPay = resolve)))
      const flow = await createFlow()

      const first = service.attempt(flow, payInfo)
      // Let the first attempt claim and reach payDebt
      await new Promise((resolve) => setTimeout(resolve, 200))
      const second = await service.attempt(flow, payInfo)
      finishPay(registered)

      expect(second).toEqual({ type: 'deferred', reason: 'in_progress' })
      await expect(first).resolves.toMatchObject({ type: 'registered' })
      expect(pay).toHaveBeenCalledTimes(1)
      expect((await getRow(flow.id))?.attempts).toBe(1)
    })

    it('lets only one of two racing attempts call FJS', async () => {
      const flow = await createFlow()

      const outcomes = await Promise.all([
        service.attempt(flow, payInfo),
        service.attempt(flow, payInfo),
      ])

      expect(pay).toHaveBeenCalledTimes(1)
      expect(outcomes.map(({ type }) => type).sort()).toEqual(
        expect.arrayContaining(['registered']),
      )
      expect((await getRow(flow.id))?.attempts).toBe(1)
    })

    it('claims again once the last attempt is old', async () => {
      pay.mockResolvedValueOnce({ type: 'transient', error: new Error('401') })
      const flow = await createFlow()
      await service.attempt(flow, payInfo)

      // Too soon
      expect(await service.attempt(flow, payInfo)).toEqual({
        type: 'deferred',
        reason: 'in_progress',
      })

      await ageLastAttempt(flow.id)
      expect(await service.attempt(flow, payInfo)).toMatchObject({
        type: 'registered',
      })
      expect((await getRow(flow.id))?.attempts).toBe(2)
    })
  })
})

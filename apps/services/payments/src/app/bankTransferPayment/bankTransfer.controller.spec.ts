import { BadRequestException } from '@nestjs/common'
import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { TestApp } from '@island.is/testing/nest'
import { BankTransferErrorCode } from '@island.is/shared/constants'

import { setupTestApp } from '../../../test/setup'
import { BankTransferService } from './bankTransfer.service'
import { BankTransferStatus } from './bankTransfer.types'
import { BankTransferLocale } from './dtos/createBankTransfer.input'

// POST defaults to 201 in Nest unless the controller decorates the handler with
// @HttpCode(200) (e.g. via @Documentation, the way paymentFlow.controller does).
// bankTransfer.controller currently uses @ApiOkResponse (Swagger metadata only),
// so success responses come back as 201.
const POST_SUCCESS = 201

// Valid 12-digit payer account number (BBAN), required by CreateBankTransferInput.
const BANK_ACCOUNT_NUMBER = '051226012345'

describe('BankTransferController', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>

  beforeAll(async () => {
    app = await setupTestApp()
    server = request(app.getHttpServer())
  })

  afterEach(() => {
    // Restore the per-test prototype spies; keep the AppModule alive for siblings.
    jest.restoreAllMocks()
  })

  afterAll(() => {
    app?.cleanUp()
  })

  describe('POST /v1/payments/bank-transfer/create', () => {
    it('delegates to BankTransferService.create with the input body and returns the response', async () => {
      const createSpy = jest
        .spyOn(BankTransferService.prototype, 'create')
        .mockResolvedValue({
          providerPaymentId: 'prov-1',
          scaRedirectUrl: 'https://blikk/sca',
          expiresAt: new Date('2026-06-02T12:00:00Z'),
        })

      const paymentFlowId = uuid()
      const response = await server
        .post('/v1/payments/bank-transfer/create')
        .send({
          paymentFlowId,
          locale: BankTransferLocale.IS,
          bankAccountNumber: BANK_ACCOUNT_NUMBER,
        })

      expect(response.status).toBe(POST_SUCCESS)
      expect(createSpy).toHaveBeenCalledWith({
        paymentFlowId,
        locale: BankTransferLocale.IS,
        bankAccountNumber: BANK_ACCOUNT_NUMBER,
      })
      expect(response.body.providerPaymentId).toBe('prov-1')
      expect(response.body.scaRedirectUrl).toBe('https://blikk/sca')
    })

    it('surfaces service errors as 400 with the error code in body.detail', async () => {
      jest
        .spyOn(BankTransferService.prototype, 'create')
        .mockRejectedValue(
          new BadRequestException(
            BankTransferErrorCode.BankTransferAlreadyInProgress,
          ),
        )

      const response = await server
        .post('/v1/payments/bank-transfer/create')
        .send({
          paymentFlowId: uuid(),
          locale: BankTransferLocale.IS,
          bankAccountNumber: BANK_ACCOUNT_NUMBER,
        })

      expect(response.status).toBe(400)
      expect(response.body.detail).toBe(
        BankTransferErrorCode.BankTransferAlreadyInProgress,
      )
    })

    it('rejects a non-UUID paymentFlowId via ValidationPipe', async () => {
      const createSpy = jest.spyOn(BankTransferService.prototype, 'create')

      const response = await server
        .post('/v1/payments/bank-transfer/create')
        .send({
          paymentFlowId: 'not-a-uuid',
          locale: BankTransferLocale.IS,
          bankAccountNumber: BANK_ACCOUNT_NUMBER,
        })

      expect(response.status).toBe(400)
      expect(createSpy).not.toHaveBeenCalled()
    })
  })

  describe('POST /v1/payments/bank-transfer/verify', () => {
    it('delegates to BankTransferService.verify and returns the status', async () => {
      const verifySpy = jest
        .spyOn(BankTransferService.prototype, 'verify')
        .mockResolvedValue({ status: BankTransferStatus.PENDING })

      const paymentFlowId = uuid()
      const response = await server
        .post('/v1/payments/bank-transfer/verify')
        .send({ paymentFlowId })

      expect(response.status).toBe(POST_SUCCESS)
      expect(verifySpy).toHaveBeenCalledWith({ paymentFlowId })
      expect(response.body.status).toBe(BankTransferStatus.PENDING)
    })

    it('rejects an empty body with 400 (no lookup key provided)', async () => {
      const verifySpy = jest.spyOn(BankTransferService.prototype, 'verify')

      const response = await server
        .post('/v1/payments/bank-transfer/verify')
        .send({})

      expect(response.status).toBe(400)
      expect(verifySpy).not.toHaveBeenCalled()
    })

    it('rejects with 400 when both paymentFlowId and providerPaymentId are provided', async () => {
      const verifySpy = jest.spyOn(BankTransferService.prototype, 'verify')

      const response = await server
        .post('/v1/payments/bank-transfer/verify')
        .send({
          paymentFlowId: uuid(),
          providerPaymentId: 'prov-1',
        })

      expect(response.status).toBe(400)
      expect(verifySpy).not.toHaveBeenCalled()
    })
  })

  describe('POST /v1/payments/bank-transfer/cancel', () => {
    it('delegates to BankTransferService.cancel and returns ok', async () => {
      const cancelSpy = jest
        .spyOn(BankTransferService.prototype, 'cancel')
        .mockResolvedValue({ ok: true })

      const paymentFlowId = uuid()
      const response = await server
        .post('/v1/payments/bank-transfer/cancel')
        .send({ paymentFlowId })

      expect(response.status).toBe(POST_SUCCESS)
      expect(cancelSpy).toHaveBeenCalledWith({ paymentFlowId })
      expect(response.body.ok).toBe(true)
    })
  })
})

import { Test, TestingModule } from '@nestjs/testing'

import { BankTransferErrorCode } from '@island.is/shared/constants'

import { BankTransferStatus } from './bankTransfer.types'
import { BankTransferController } from './bankTransfer.controller'
import { BankTransferService } from './bankTransfer.service'
import { BankTransferLocale } from './dtos/createBankTransfer.input'

describe('BankTransferController', () => {
  let controller: BankTransferController
  let bankTransferService: jest.Mocked<
    Pick<BankTransferService, 'create' | 'verify'>
  >

  beforeEach(async () => {
    bankTransferService = {
      create: jest.fn(),
      verify: jest.fn(),
    } as unknown as jest.Mocked<
      Pick<BankTransferService, 'create' | 'verify'>
    >

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankTransferController],
      providers: [
        { provide: BankTransferService, useValue: bankTransferService },
      ],
    }).compile()

    controller = module.get<BankTransferController>(BankTransferController)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('POST /create', () => {
    it('delegates to bankTransferService.create with the input body', async () => {
      bankTransferService.create.mockResolvedValue({
        providerPaymentId: 'prov-1',
        scaRedirectUrl: 'https://blikk/sca',
      })

      const result = await controller.create({
        paymentFlowId: 'flow-1',
        locale: BankTransferLocale.IS,
      })

      expect(bankTransferService.create).toHaveBeenCalledWith({
        paymentFlowId: 'flow-1',
        locale: BankTransferLocale.IS,
      })
      expect(result).toEqual({
        providerPaymentId: 'prov-1',
        scaRedirectUrl: 'https://blikk/sca',
      })
    })

    it('propagates service errors to the caller', async () => {
      bankTransferService.create.mockRejectedValue(
        new Error(BankTransferErrorCode.BankTransferAlreadyInProgress),
      )

      await expect(
        controller.create({
          paymentFlowId: 'flow-1',
          locale: BankTransferLocale.IS,
        }),
      ).rejects.toThrow(BankTransferErrorCode.BankTransferAlreadyInProgress)
    })
  })

  describe('POST /verify', () => {
    it('delegates to bankTransferService.verify with the input body', async () => {
      bankTransferService.verify.mockResolvedValue({
        status: BankTransferStatus.PENDING,
      })

      const result = await controller.verify({ paymentFlowId: 'flow-1' })

      expect(bankTransferService.verify).toHaveBeenCalledWith({
        paymentFlowId: 'flow-1',
      })
      expect(result.status).toBe(BankTransferStatus.PENDING)
    })
  })
})

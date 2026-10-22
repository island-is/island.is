import request from 'supertest'
import { INestApplication, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuditModule } from '@island.is/nest/audit'
import { ApplicationService } from '@island.is/application/api/core'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'
import {
  PaymentModule,
  PaymentModuleConfig,
  PaymentService,
} from '@island.is/application/api/payment'
import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import {
  GetPaymentFlowStatusDTOPaymentStatusEnum,
  PaymentsApi,
  PaymentsApiClientConfig,
} from '@island.is/clients/payments'
import { IdsClientConfig } from '@island.is/nest/config'
import { createCurrentUser } from '@island.is/testing/fixtures'

import { SequelizeConfigService } from '../../../../sequelizeConfig.service'
import { setup } from '../../../../../../test/setup'

const user = createCurrentUser({
  scope: [ApplicationScope.read, ApplicationScope.write],
})

const mockPaymentsApi = {
  debtPaymentFlowControllerCreateDebtPaymentUrl: jest.fn(),
  paymentFlowControllerGetPaymentFlowStatus: jest.fn(),
  paymentFlowControllerGetPaymentFlow: jest.fn(),
  paymentFlowControllerDeletePaymentFlow: jest.fn(),
}

const debts = [
  { payId: 'PAY-1', amount: 10000, label: 'Þjónustugjald - 1' },
  { payId: 'PAY-3', amount: 30000, label: 'Þjónustugjald - 3' },
]

const flowCreated = (id: string) => ({
  id,
  urls: {
    is: `https://pay.example/is/${id}`,
    en: `https://pay.example/en/${id}`,
  },
})

const sendCallback = (
  type: string,
  reason: string,
  applicationId: string,
  paymentId: string,
  message = '',
) =>
  server
    .post('/application-payment/api-client-payment-callback')
    .send({
      type,
      paymentFlowId: 'flow-id',
      paymentFlowMetadata: { applicationId, paymentId },
      occurredAt: new Date().toISOString(),
      details: {
        paymentMethod: 'card',
        reason,
        message,
        eventMetadata: {},
      },
    })
    .expect(201)

const paidFlow = (isClosed: boolean) => {
  mockPaymentsApi.paymentFlowControllerGetPaymentFlowStatus.mockResolvedValue({
    paymentStatus: GetPaymentFlowStatusDTOPaymentStatusEnum.paid,
  })
  mockPaymentsApi.paymentFlowControllerGetPaymentFlow.mockResolvedValue({
    isClosed,
  })
}

@Module({
  imports: [
    SequelizeModule.forRootAsync({ useClass: SequelizeConfigService }),
    PaymentModule,
    AuditModule.forRoot({ defaultNamespace: '@island.is/applications' }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [PaymentModuleConfig, PaymentsApiClientConfig, IdsClientConfig],
    }),
  ],
})
class DebtPaymentTestModule {}

let app: INestApplication
let server: request.SuperTest<request.Test>
let service: PaymentService

beforeAll(async () => {
  app = await setup(DebtPaymentTestModule, {
    override: (builder) =>
      builder
        .overrideProvider(PaymentsApi)
        .useValue(mockPaymentsApi)
        .overrideGuard(IdsUserGuard)
        .useValue(new MockAuthGuard(user)),
  })

  server = request(app.getHttpServer())
  service = app.get(PaymentService)
})

const createApplication = async () =>
  (
    await app.get(ApplicationService).create({
      typeId: ApplicationTypes.PAY_DEBTS,
      applicant: user.nationalId,
      assignees: [],
      state: 'draft',
      status: ApplicationStatus.DRAFT,
      answers: {},
    })
  ).id

beforeEach(() => {
  jest.resetAllMocks()
  mockPaymentsApi.debtPaymentFlowControllerCreateDebtPaymentUrl.mockResolvedValue(
    flowCreated('flow-id'),
  )
})

describe('Debt payments', () => {
  it('creates a flow for the debts once and reuses it after', async () => {
    const applicationId = await createApplication()

    const created = await service.createDebtPayment(user, applicationId, debts)
    const reused = await service.createDebtPayment(user, applicationId, debts)

    expect(reused).toEqual(created)
    expect(
      mockPaymentsApi.debtPaymentFlowControllerCreateDebtPaymentUrl,
    ).toHaveBeenCalledTimes(1)
    expect(
      mockPaymentsApi.debtPaymentFlowControllerCreateDebtPaymentUrl,
    ).toHaveBeenCalledWith({
      createDebtPaymentFlowInput: expect.objectContaining({
        payerNationalId: user.nationalId,
        metadata: { applicationId, paymentId: created.id },
        debts,
      }),
    })

    const payment = await service.findPaymentByApplicationId(applicationId)
    expect(Number(payment?.amount)).toBe(40000)
    expect(payment?.request_id).toBe('flow-id')
  })

  it('creates the flow with the current debts after a failed attempt', async () => {
    const applicationId = await createApplication()
    mockPaymentsApi.debtPaymentFlowControllerCreateDebtPaymentUrl.mockRejectedValueOnce(
      new Error('DebtPaymentUnavailable'),
    )

    await expect(
      service.createDebtPayment(user, applicationId, debts),
    ).rejects.toThrow()
    await service.createDebtPayment(user, applicationId, [debts[0]])

    expect(
      mockPaymentsApi.debtPaymentFlowControllerCreateDebtPaymentUrl,
    ).toHaveBeenLastCalledWith({
      createDebtPaymentFlowInput: expect.objectContaining({
        debts: [debts[0]],
      }),
    })
    const payment = await service.findPaymentByApplicationId(applicationId)
    expect(Number(payment?.amount)).toBe(10000)
  })

  it('is paid on payment_completed and unpaid again on payment_failed', async () => {
    const applicationId = await createApplication()
    const { id } = await service.createDebtPayment(user, applicationId, debts)

    await sendCallback('success', 'payment_completed', applicationId, id)
    expect((await service.getStatus(applicationId)).fulfilled).toBe(true)

    mockPaymentsApi.paymentFlowControllerGetPaymentFlow.mockResolvedValue({
      isClosed: true,
    })
    await sendCallback(
      'error',
      'payment_failed',
      applicationId,
      id,
      'FJS rejected the debt payment',
    )
    expect((await service.getStatus(applicationId)).fulfilled).toBe(false)
    expect(
      mockPaymentsApi.paymentFlowControllerGetPaymentFlowStatus,
    ).not.toHaveBeenCalled()
  })

  it('still fulfils a paid flow after a failed bank transfer attempt', async () => {
    const applicationId = await createApplication()
    const { id } = await service.createDebtPayment(user, applicationId, debts)
    paidFlow(false)

    await sendCallback(
      'error',
      'payment_failed',
      applicationId,
      id,
      'Bank transfer REJECTED',
    )

    expect((await service.getStatus(applicationId)).fulfilled).toBe(true)
  })

  it('fulfils a paid flow whose success callback never came', async () => {
    const applicationId = await createApplication()
    await service.createDebtPayment(user, applicationId, debts)
    paidFlow(false)

    expect((await service.getStatus(applicationId)).fulfilled).toBe(true)
    expect(
      (await service.findPaymentByApplicationId(applicationId))?.fulfilled,
    ).toBe(true)
  })

  it('does not fulfil a paid flow FJS rejected', async () => {
    const applicationId = await createApplication()
    await service.createDebtPayment(user, applicationId, debts)
    paidFlow(true)

    expect((await service.getStatus(applicationId)).fulfilled).toBe(false)
  })

  it('refuses to delete a paid flow, and deletes an unpaid one without a refund', async () => {
    const paidId = await createApplication()
    await service.createDebtPayment(user, paidId, debts)
    paidFlow(false)

    await expect(service.deleteDebtPayment(paidId, user)).rejects.toThrow(
      'PaymentFlowAlreadyPaid',
    )
    expect(await service.findPaymentByApplicationId(paidId)).not.toBeNull()

    const unpaidId = await createApplication()
    await service.createDebtPayment(user, unpaidId, debts)
    mockPaymentsApi.paymentFlowControllerGetPaymentFlowStatus.mockResolvedValue(
      {
        paymentStatus: GetPaymentFlowStatusDTOPaymentStatusEnum.unpaid,
      },
    )

    await service.deleteDebtPayment(unpaidId, user)

    expect(
      mockPaymentsApi.paymentFlowControllerDeletePaymentFlow,
    ).toHaveBeenCalledWith({ id: 'flow-id' })
    expect(await service.findPaymentByApplicationId(unpaidId)).toBeNull()
  })
})

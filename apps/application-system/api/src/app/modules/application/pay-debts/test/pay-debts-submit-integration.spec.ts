import request from 'supertest'
import { INestApplication } from '@nestjs/common'

import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'
import { ApplicationTypes } from '@island.is/application/types'
import { PaymentService } from '@island.is/application/api/payment'
import { FinanceClientV3Service } from '@island.is/clients/finance-v3'
import { createNationalId } from '@island.is/testing/fixtures'

import { setup } from '../../../../../../test/setup'
import { AppModule } from '../../../../app.module'

const GET_DEBTS_ACTION_ID = 'PayDebts.getCustomerDebts'

const makeDebt = (payID: string, debts: number) => ({
  chargeTypeId: 'A1',
  chargeTypeName: 'Þjónustugjald',
  chargeItemSubject: `Gjaldgrunnur ${payID}`,
  timePeriod: '2026',
  dueDate: '2026-02-01',
  finalDueDate: '2026-03-01',
  principal: BigInt(debts),
  interest: BigInt(0),
  cost: BigInt(0),
  debts: BigInt(debts),
  payID,
  documentID: `DOC-${payID}`,
})

const allDebts = [
  makeDebt('PAY-1', 10000),
  makeDebt('PAY-2', 20000),
  makeDebt('PAY-3', 30000),
]

class MockFinanceClientV3Service {
  async getCustomerDebts() {
    return {
      message: 'Success',
      timestamp: '2026-10-05T12:00:00Z',
      nextkey: '',
      debts: allDebts,
    }
  }
}

let paidDebts: { payId: string; amount: number }[] = []

class MockPaymentService {
  async createDebtPayment(
    _user: unknown,
    _applicationId: string,
    debts: { payId: string; amount: number }[],
  ) {
    paidDebts = debts
    return { id: 'payment-id', paymentUrl: 'https://payment.example' }
  }
}

const mockAuthGuard = new MockAuthGuard({
  nationalId: createNationalId('any'),
  scope: [ApplicationScope.read, ApplicationScope.write],
})

let app: INestApplication
let server: request.SuperTest<request.Test>

beforeAll(async () => {
  app = await setup(AppModule, {
    override: (builder) =>
      builder
        .overrideProvider(FinanceClientV3Service)
        .useClass(MockFinanceClientV3Service)
        .overrideProvider(PaymentService)
        .useClass(MockPaymentService)
        .overrideGuard(IdsUserGuard)
        .useValue(mockAuthGuard),
  })

  server = request(app.getHttpServer())
})

const createApplication = async () => {
  const response = await server
    .post('/applications')
    .send({ typeId: ApplicationTypes.PAY_DEBTS })
    .expect(201)

  return response.body.id as string
}

const fetchDebts = (id: string) =>
  server
    .put(`/applications/${id}/externalData`)
    .send({
      dataProviders: [{ actionId: GET_DEBTS_ACTION_ID, order: 0 }],
    })
    .expect(200)

const selectDebts = (id: string, selectedPayIds: string[]) =>
  server.put(`/applications/${id}`).send({
    answers: {
      selectedDebts: allDebts.map((debt) =>
        selectedPayIds.includes(debt.payID),
      ),
      selectedDebtIds: allDebts.map((debt) => debt.payID),
    },
  })

describe('Pay debts submit', () => {
  it('moves from draft to payment on submit, paying only the ticked debts', async () => {
    const id = await createApplication()
    await fetchDebts(id)
    await selectDebts(id, ['PAY-1', 'PAY-3']).expect(200)

    const response = await server
      .put(`/applications/${id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    expect(response.body.state).toBe('payment')
    expect(paidDebts).toEqual([
      expect.objectContaining({ payId: 'PAY-1', amount: 10000 }),
      expect.objectContaining({ payId: 'PAY-3', amount: 30000 }),
    ])
  })
})

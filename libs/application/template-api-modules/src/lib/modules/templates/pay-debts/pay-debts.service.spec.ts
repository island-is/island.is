import type { ApplicationWithAttachments } from '@island.is/application/types'
import type { User } from '@island.is/auth-nest-tools'
import { FinanceClientV3Service } from '@island.is/clients/finance-v3'
import type { AuditService } from '@island.is/nest/audit'
import type { PaymentService } from '@island.is/application/api/payment'
import type { Logger } from '@island.is/logging'
import payDebtsTemplate from '@island.is/application/templates/pay-debts'
import { PayDebtsService } from './pay-debts.service'

describe('PayDebtsService', () => {
  it('gets and maps customer debts', async () => {
    const getCustomerDebts = jest.fn().mockResolvedValue({
      message: 'Success',
      timestamp: '2026-08-19T12:00:00Z',
      moreDebts: true,
      debts: [
        {
          chargeTypeId: 'A1',
          chargeTypeName: 'Example charge',
          chargeItemSubject: 'Example subject',
          timePeriod: '2025',
          dueDate: '2026-02-01',
          finalDueDate: '2026-03-01',
          principal: BigInt(110000),
          interest: BigInt(12000),
          cost: BigInt(3000),
          debts: BigInt(125000),
          payID: 'PAY-123',
          documentID: 'DOC-123',
        },
      ],
    })
    const getPayrollDeduction = jest.fn().mockResolvedValue(null)
    const financeClient = {
      getCustomerDebts,
      getPayrollDeduction,
    } as unknown as FinanceClientV3Service
    const downloadServiceConfig = {
      baseUrl: 'http://localhost:3377',
      isConfigured: true,
    }
    const audit = jest.fn()
    const auditService = { audit } as unknown as AuditService
    const service = new PayDebtsService(
      financeClient,
      downloadServiceConfig,
      auditService,
      {} as PaymentService,
      { warn: jest.fn() } as unknown as Logger,
    )
    const nationalId = '0101307789'
    const auth = { nationalId } as User
    const application = { id: 'application-id' } as ApplicationWithAttachments

    const result = await service.getCustomerDebts({
      application,
      auth,
      currentUserLocale: 'is',
    })

    expect(getCustomerDebts).toHaveBeenCalledWith(auth, {
      nationalID: nationalId,
    })
    expect(audit).toHaveBeenCalledWith({
      auth,
      action: 'getCustomerDebts',
      resources: application.id,
      meta: { debtCount: 1 },
    })
    expect(result).toEqual({
      message: 'Success',
      timestamp: '2026-08-19T12:00:00Z',
      moreDebts: true,
      downloadServiceURL: 'http://localhost:3377/download/v1/finance/',
      debts: [
        {
          chargeTypeId: 'A1',
          chargeTypeName: 'Example charge',
          chargeItemSubject: 'Example subject',
          timePeriod: '2025',
          dueDate: '2026-02-01',
          finalDueDate: '2026-03-01',
          principal: 110000,
          interest: 12000,
          cost: 3000,
          debts: 125000,
          payID: 'PAY-123',
          documentID: 'DOC-123',
        },
      ],
    })
  })

  it('names the employer on debts whose charge type allows payroll deduction', async () => {
    const debt = {
      chargeTypeName: 'Example charge',
      chargeItemSubject: 'Example subject',
      timePeriod: '2025',
      dueDate: '2026-02-01',
      finalDueDate: '2026-03-01',
      principal: BigInt(1),
      interest: BigInt(1),
      cost: BigInt(1),
      debts: BigInt(3),
      payID: 'PAY-123',
      documentID: 'DOC-123',
    }
    const financeClient = {
      getCustomerDebts: jest.fn().mockResolvedValue({
        debts: [
          { ...debt, chargeTypeId: 'A1' },
          { ...debt, chargeTypeId: 'B2' },
        ],
      }),
      getPayrollDeduction: jest.fn().mockResolvedValue({
        employerId: '5512345678',
        name: 'Launagreiðandi ehf.',
        chargeTypeId: ['A1'],
      }),
    } as unknown as FinanceClientV3Service
    const service = new PayDebtsService(
      financeClient,
      { baseUrl: 'http://localhost:3377', isConfigured: true },
      { audit: jest.fn() } as unknown as AuditService,
      {} as PaymentService,
      { warn: jest.fn() } as unknown as Logger,
    )

    const result = await service.getCustomerDebts({
      application: { id: 'application-id' } as ApplicationWithAttachments,
      auth: { nationalId: '0101307789' } as User,
      currentUserLocale: 'is',
    })

    expect(result.debts.map((d) => d.salaryPayerName)).toEqual([
      'Launagreiðandi ehf.',
      undefined,
    ])
  })

  it('still returns the debts when the payroll deduction lookup fails', async () => {
    const financeClient = {
      getCustomerDebts: jest.fn().mockResolvedValue({
        debts: [
          {
            chargeTypeId: 'A1',
            chargeTypeName: 'Example charge',
            chargeItemSubject: 'Example subject',
            timePeriod: '2025',
            dueDate: '2026-02-01',
            finalDueDate: '2026-03-01',
            principal: BigInt(1),
            interest: BigInt(1),
            cost: BigInt(1),
            debts: BigInt(3),
            payID: 'PAY-123',
            documentID: 'DOC-123',
          },
        ],
      }),
      getPayrollDeduction: jest.fn().mockRejectedValue(new Error('500')),
    } as unknown as FinanceClientV3Service
    const logger = { warn: jest.fn() }
    const service = new PayDebtsService(
      financeClient,
      { baseUrl: 'http://localhost:3377', isConfigured: true },
      { audit: jest.fn() } as unknown as AuditService,
      {} as PaymentService,
      logger as unknown as Logger,
    )

    const result = await service.getCustomerDebts({
      application: { id: 'application-id' } as ApplicationWithAttachments,
      auth: { nationalId: '0101307789' } as User,
      currentUserLocale: 'is',
    })

    expect(result.debts).toHaveLength(1)
    expect(result.debts[0].salaryPayerName).toBeUndefined()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('pays only the ticked debts, each in full', async () => {
    const debt = (payID: string, debts: number) => ({
      payID,
      chargeTypeId: 'A1',
      chargeTypeName: 'Þjónustugjald',
      chargeItemSubject: payID,
      timePeriod: '2026',
      dueDate: '2026-02-01',
      finalDueDate: '2026-03-01',
      principal: debts,
      interest: 0,
      cost: 0,
      debts,
    })
    const debts = [
      debt('PAY-1', 10000),
      debt('PAY-2', 20000),
      debt('PAY-3', 30000),
    ]
    const createDebtPayment = jest.fn().mockResolvedValue({
      id: 'payment-id',
      paymentUrl: 'https://payment.example',
    })
    const service = new PayDebtsService(
      {} as FinanceClientV3Service,
      { baseUrl: 'http://localhost:3377', isConfigured: true },
      { audit: jest.fn() } as unknown as AuditService,
      { createDebtPayment } as unknown as PaymentService,
      { warn: jest.fn() } as unknown as Logger,
    )
    const auth = { nationalId: '0101307789' } as User

    await service.createDebtPayment({
      application: {
        id: 'application-id',
        externalData: {
          customerDebts: {
            data: { debts },
            date: new Date(),
            status: 'success',
          },
        },
        answers: {
          selectedDebts: [true, false, true],
          selectedDebtIds: debts.map((d) => d.payID),
        },
      } as unknown as ApplicationWithAttachments,
      auth,
      currentUserLocale: 'is',
    })

    expect(createDebtPayment).toHaveBeenCalledWith(
      auth,
      'application-id',
      [
        expect.objectContaining({ payId: 'PAY-1', amount: 10000 }),
        expect.objectContaining({ payId: 'PAY-3', amount: 30000 }),
      ],
      'is',
    )
  })

  it('implements every PayDebts action the template calls', () => {
    const actions = Object.values(
      payDebtsTemplate.stateMachineConfig.states,
    ).flatMap(({ meta }) => [
      ...[meta?.onEntry ?? []].flat(),
      ...[meta?.onExit ?? []].flat(),
      ...(meta?.roles ?? []).flatMap((role) => role.api ?? []),
    ])
    const payDebtsActions = actions
      .filter((api) => api.actionId.startsWith('PayDebts.'))
      .map((api) => api.action)

    expect(payDebtsActions).toHaveLength(3)
    payDebtsActions.forEach((action) =>
      expect(
        typeof PayDebtsService.prototype[action as keyof PayDebtsService],
      ).toBe('function'),
    )
  })
})

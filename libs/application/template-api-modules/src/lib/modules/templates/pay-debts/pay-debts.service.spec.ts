import type { ApplicationWithAttachments } from '@island.is/application/types'
import type { User } from '@island.is/auth-nest-tools'
import { FinanceClientV3Service } from '@island.is/clients/finance-v3'
import type { AuditService } from '@island.is/nest/audit'
import { PayDebtsService } from './pay-debts.service'

describe('PayDebtsService', () => {
  it('gets and maps customer debts', async () => {
    const getCustomerDebts = jest.fn().mockResolvedValue({
      message: 'Success',
      timestamp: '2026-08-19T12:00:00Z',
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
    const financeClient = {
      getCustomerDebts,
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
})

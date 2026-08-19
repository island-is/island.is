import type { ApplicationWithAttachments } from '@island.is/application/types'
import type { User } from '@island.is/auth-nest-tools'
import { FinanceClientV3Service } from '@island.is/clients/finance-v3'
import { PayDebtsService } from './pay-debts.service'

describe('PayDebtsService', () => {
  it('gets and maps customer debts', async () => {
    const getCustomerDebts = jest.fn().mockResolvedValue({
      message: 'Success',
      timestamp: '2026-08-19T12:00:00Z',
      nextkey: 'next-page',
      debts: [
        {
          chargeTypeId: 'A1',
          chargeTypeName: 'Example charge',
          chargeItemSubject: 'Example subject',
          timePeriod: '2025',
          dueDate: '2026-02-01',
          finalDueDate: '2026-03-01',
          debts: BigInt(125000),
          payID: 'PAY-123',
        },
      ],
    })
    const financeClient = {
      getCustomerDebts,
    } as unknown as FinanceClientV3Service
    const service = new PayDebtsService(financeClient)
    const nationalId = '0101307789'
    const auth = { nationalId } as User

    const result = await service.getCustomerDebts({
      application: {} as ApplicationWithAttachments,
      auth,
      currentUserLocale: 'is',
      params: { nextKey: 'current-page' },
    })

    expect(getCustomerDebts).toHaveBeenCalledWith(auth, {
      nationalID: nationalId,
      nextKey: 'current-page',
    })
    expect(result).toEqual({
      message: 'Success',
      timestamp: '2026-08-19T12:00:00Z',
      nextkey: 'next-page',
      debts: [
        {
          chargeTypeId: 'A1',
          chargeTypeName: 'Example charge',
          chargeItemSubject: 'Example subject',
          timePeriod: '2025',
          dueDate: '2026-02-01',
          finalDueDate: '2026-03-01',
          debts: 125000,
          payID: 'PAY-123',
        },
      ],
    })
  })
})

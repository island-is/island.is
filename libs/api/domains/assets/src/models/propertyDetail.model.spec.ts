import { MiddlewareContext } from '@nestjs/graphql'
import { isPropertyOwner, PropertyDetail } from './propertyDetail.model'

const MOCK_PROPERTY: PropertyDetail = {
  registeredOwners: {
    registeredOwners: [
      {
        ssn: '1234',
      },
    ],
  },
}

describe('Asset Models', () => {
  describe.only('PropertyDetail model', () => {
    it('Owner should be allowed to acces data', async () => {
      const property: PropertyDetail & { nationalId: string } = {
        nationalId: '1234',
        ...MOCK_PROPERTY,
      }
      const context = { source: property } as MiddlewareContext
      expect(isPropertyOwner(context)).toBeTruthy()
    })
    it('Non-owner should not be allowed to access data', async () => {
      const property: PropertyDetail & { nationalId: string } = {
        nationalId: '4321',
        ...MOCK_PROPERTY,
      }
      const context = { source: property } as MiddlewareContext
      expect(isPropertyOwner(context)).toBeFalsy()
    })
  })
})

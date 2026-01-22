import { v4 as uuid } from 'uuid'

import { User } from '@island.is/judicial-system/types'

import { createTestingSubpoenaModule } from '../createTestingSubpoenaModule'

import { PoliceService } from '../../../police/police.service'
import { Case, Subpoena } from '../../../repository'

interface Then {
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalSubpoenaController - Deliver subpoena revocation to police', () => {
  const caseId = uuid()
  const subpoenaId = uuid()
  const policeSubpoenaId = uuid()
  const defendantId = uuid()

  const subpoena = { id: subpoenaId, policeSubpoenaId } as Subpoena
  const theCase = { id: caseId } as Case

  const userId = uuid()
  const user = { id: userId } as User

  let mockPoliceService: PoliceService

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { internalSubpoenaController, policeService } =
      await createTestingSubpoenaModule()

    mockPoliceService = policeService

    const mockRevokeSubpoena = mockPoliceService.revokeSubpoena as jest.Mock

    mockRevokeSubpoena.mockResolvedValueOnce(true)

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        await internalSubpoenaController.deliverSubpoenaRevocationToNationalCommissionersOffice(
          caseId,
          defendantId,
          subpoenaId,
          theCase,
          subpoena,
          { user },
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('subpoena revoked delivered to police', () => {
    beforeEach(async () => {
      await givenWhenThen()
    })

    it('should call the police service with the correct subpoena id', () => {
      expect(mockPoliceService.revokeSubpoena).toHaveBeenCalledWith(
        theCase,
        policeSubpoenaId,
        user,
      )
    })
  })
})

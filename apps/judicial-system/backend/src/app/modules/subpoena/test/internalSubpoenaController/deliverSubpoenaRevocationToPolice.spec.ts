import { uuid } from 'uuidv4'

import { createTestingSubpoenaModule } from '../createTestingSubpoenaModule'

import { Case } from '../../../case'
import { DeliverDto } from '../../dto/deliver.dto'
import { DeliverResponse } from '../../models/deliver.response'
import { Subpoena } from '../../models/subpoena.model'
import { SubpoenaService } from '../../subpoena.service'

interface Then {
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalSubpoenaController - Deliver subpoena revocation to police', () => {
  const caseId = uuid()
  const subpoenaId = uuid()
  const defendantId = uuid()

  const subpoena = { id: subpoenaId } as Subpoena
  const theCase = { id: caseId } as Case
  const user = { user: { id: uuid() } } as DeliverDto
  const delivered = { delivered: true } as DeliverResponse

  let mockSubpoenaService: SubpoenaService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { subpoenaService, internalSubpoenaController } =
      await createTestingSubpoenaModule()

    mockSubpoenaService = subpoenaService

    const deliverSubpoenaRevokedToPoliceMock = jest.fn()
    mockSubpoenaService.deliverSubpoenaRevocationToPolice =
      deliverSubpoenaRevokedToPoliceMock

    deliverSubpoenaRevokedToPoliceMock.mockResolvedValueOnce(delivered)

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        await internalSubpoenaController.deliverSubpoenaRevocationToPolice(
          caseId,
          defendantId,
          subpoenaId,
          theCase,
          subpoena,
          user,
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

    it('should call deliverSubpoenaRevokedToPolice', () => {
      expect(
        mockSubpoenaService.deliverSubpoenaRevocationToPolice,
      ).toHaveBeenCalledWith(theCase, subpoena, user.user)
    })
  })
})

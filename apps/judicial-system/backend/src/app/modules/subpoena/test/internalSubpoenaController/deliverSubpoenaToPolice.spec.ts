import { uuid } from 'uuidv4'

import { createTestingSubpoenaModule } from '../createTestingSubpoenaModule'

import { Case } from '../../../case'
import { Defendant } from '../../../defendant'
import { DeliverResponse } from '../../models/deliver.response'
import { Subpoena } from '../../models/subpoena.model'
import { SubpoenaService } from '../../subpoena.service'

interface Then {
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalSubpoenaController - Deliver subpoena to police', () => {
  const caseId = uuid()
  const subpoenaId = uuid()
  const defendantId = uuid()

  const subpoena = { id: subpoenaId } as Subpoena
  const defendant = { id: defendantId, subpoenas: [subpoena] } as Defendant
  const theCase = { id: caseId } as Case
  const user = { user: { id: uuid() } } as any
  const delivered = { delivered: true } as DeliverResponse

  let mockSubpoenaService: SubpoenaService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { subpoenaService, internalSubpoenaController } =
      await createTestingSubpoenaModule()

    mockSubpoenaService = subpoenaService

    const deliverSubpoenaToPoliceMock =
      (mockSubpoenaService.deliverSubpoenaToPolice = jest.fn())

    deliverSubpoenaToPoliceMock.mockResolvedValueOnce(delivered)

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        await internalSubpoenaController.deliverSubpoenaToPolice(
          caseId,
          defendantId,
          subpoenaId,
          theCase,
          defendant,
          subpoena,
          user,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('subpoena delivered to police', () => {
    beforeEach(async () => {
      await givenWhenThen()
    })

    it('should call deliverSubpoenaToPolice', () => {
      expect(mockSubpoenaService.deliverSubpoenaToPolice).toHaveBeenCalledWith(
        theCase,
        defendant,
        subpoena,
        user.user,
      )
    })
  })
})

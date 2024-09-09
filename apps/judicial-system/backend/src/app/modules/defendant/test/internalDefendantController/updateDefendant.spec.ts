import { uuid } from 'uuidv4'

import { DefenderChoice, User } from '@island.is/judicial-system/types'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import { Case } from '../../../case'
import { Defendant } from '../../models/defendant.model'

interface Then {
  result: Defendant
  error: Error
}

type GivenWhenThen = (defendant: Defendant) => Promise<Then>
describe('InternalDefendantController - Update defendant', () => {
  const caseId = uuid()
  const defendantId = uuid()
  const defendantNationalId = '1234567890'
  const defendant = {
    id: defendantId,
    nationalId: defendantNationalId,
    defenderChoice: DefenderChoice.DELAY,
  } as Defendant
  const theCase = {
    id: caseId,
    defendants: [defendant],
  } as Case

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { internalDefendantController } = await createTestingDefendantModule()

    givenWhenThen = async (defendant: Defendant) => {
      const then = {} as Then

      await internalDefendantController
        .updateDefendant(caseId, defendantNationalId, theCase, defendant)
        .then((result) => {
          then.result = result
        })
        .catch((error) => {
          then.error = error
        })

      return then
    }
  })

  describe('Update defendant', () => {
    it('should update defendant', async () => {
      const { result, error } = await givenWhenThen(defendant)

      expect(result).toEqual(defendant)
      expect(error).toBeUndefined()
    })
  })
})

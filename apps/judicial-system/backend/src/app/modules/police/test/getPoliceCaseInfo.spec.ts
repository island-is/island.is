import fetch from 'isomorphic-fetch'
import { uuid } from 'uuidv4'

import { NotFoundException } from '@nestjs/common'
import { User } from '@island.is/judicial-system/types'

import { Case } from '../../case'
import { PoliceCaseInfo } from '../models/policeCaseInfo.model'
import { createTestingPoliceModule } from './createTestingPoliceModule'

jest.mock('isomorphic-fetch')

interface Then {
  result: PoliceCaseInfo[]
  error: Error & { detail: string }
}

type GivenWhenThen = (
  caseId: string,
  user: User,
  theCase: Case,
) => Promise<Then>

describe('PoliceController - Get police case info', () => {
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { policeController } = await createTestingPoliceModule()

    givenWhenThen = async (
      caseId: string,
      user: User,
      theCase: Case,
    ): Promise<Then> => {
      const then = {} as Then

      await policeController
        .getPoliceCaseInfo(caseId, user, theCase)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('police case info found', () => {
    const theUser = {} as User
    const theCase = {} as Case
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          malsnumer: '007-2021-000007',
          skjol: [
            { malsnumer: '007-2021-000007' },
            { malsnumer: '007-2020-000103' },
            { malsnumer: '007-2019-000057' },
            { malsnumer: '008-2018-000039' },
            { malsnumer: '008-2018-000039' },
          ],
          malseinings: [
            {
              upprunalegtMalsnumer: '007-2021-000007',
              brotFra: '2021-02-23T13:17:00',
              vettvangur: 'Hverfisgata 113, 101',
            },
          ],
        }),
      })

      then = await givenWhenThen(uuid(), theUser, theCase)
    })

    it('should return police case info without duplicates', () => {
      expect(then.result).toEqual([
        {
          caseNumber: '007-2021-000007',
          crimeScene: 'Hverfisgata 113, 101',
          crimeDate: '2021-02-23T13:17:00',
        },
        { caseNumber: '007-2020-000103' },
        { caseNumber: '007-2019-000057' },
        { caseNumber: '008-2018-000039' },
      ])
    })
  })

  describe('police case info not found', () => {
    const user = {} as User
    const originalAncestorCaseId = uuid()
    const theCase = { id: originalAncestorCaseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({ ok: false, text: () => 'Some error' })

      then = await givenWhenThen(uuid(), user, theCase)
    })

    it('should throw not found exception', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(
        `Police case info for case ${originalAncestorCaseId} does not exist`,
      )
    })
  })
})

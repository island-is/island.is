import fetch from 'isomorphic-fetch'
import { uuid } from 'uuidv4'

import { BadGatewayException, NotFoundException } from '@nestjs/common'

import { User } from '@island.is/judicial-system/types'

import { createTestingPoliceModule } from './createTestingPoliceModule'

import { Case } from '../../repository'
import { PoliceCaseFile } from '../models/policeCaseFile.model'

jest.mock('isomorphic-fetch')

interface Then {
  result: PoliceCaseFile[]
  error: Error & { detail: string }
}

type GivenWhenThen = (
  caseId: string,
  user: User,
  theCase: Case,
) => Promise<Then>

describe('PoliceController - Get all', () => {
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
        .getAll(caseId, user, theCase)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('remote call', () => {
    const user = {} as User
    const originalAncestorCaseId = uuid()
    const theCsae = { id: originalAncestorCaseId } as Case

    beforeEach(async () => {
      await givenWhenThen(uuid(), user, theCsae)
    })

    it('should request police files for the correct case', () => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(
          new RegExp(`.*/GetDocumentListById/${originalAncestorCaseId}`),
        ),
        expect.anything(),
      )
    })
  })

  describe('police files found', () => {
    const theUser = {} as User
    const theCase = {} as Case
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          malsnumer: '000-0000-0000',
          skjol: [
            {
              dagsStofnad: '2020-01-01',
              domsSkjalsFlokkun: 'dsf1',
              rvMalSkjolMals_ID: 1,
              heitiSkjals: 'Name 1',
              malsnumer: 'malsnumer1',
              skjalasnid: '.pdf',
            },
            {
              dagsStofnad: '2020-01-01',
              rvMalSkjolMals_ID: 2,
              heitiSkjals: 'Name 2',
              flokkurSkjals: 'flokkur2',
              malsnumer: 'malsnumer2',
            },
          ],
          malseinings: [
            {
              vettvangur: '',
              brotFra: '',
              upprunalegtMalsnumer: '',
              licencePlate: '',
            },
          ],
        }),
      })

      then = await givenWhenThen(uuid(), theUser, theCase)
    })

    it('should return police case files', () => {
      expect(then.result).toEqual([
        {
          id: '1',
          name: 'Name 1.pdf',
          displayDate: '2020-01-01',
          policeCaseNumber: 'malsnumer1',
        },
        {
          id: '2',
          name: 'Name 2.pdf',
          displayDate: '2020-01-01',
          policeCaseNumber: 'malsnumer2',
        },
      ])
    })
  })

  describe('police files not found', () => {
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
        `Police case for case ${originalAncestorCaseId} does not exist`,
      )
    })
  })

  describe('remote call fails', () => {
    const user = {} as User
    const originalAncestorCaseId = uuid()
    const theCase = { id: originalAncestorCaseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(uuid(), user, theCase)
    })

    it('should throw bad gateway exception', () => {
      expect(then.error).toBeInstanceOf(BadGatewayException)
      expect(then.error.message).toBe(
        `Failed to get police case files for case ${originalAncestorCaseId}`,
      )
    })
  })
})

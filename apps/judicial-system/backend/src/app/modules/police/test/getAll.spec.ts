import fetch from 'isomorphic-fetch'
import { uuid } from 'uuidv4'

import { BadGatewayException, NotFoundException } from '@nestjs/common'

import { User } from '@island.is/judicial-system/types'

import { Case } from '../../case'
import { PoliceCaseFile } from '../models/policeCaseFile.model'
import { createTestingPoliceModule } from './createTestingPoliceModule'

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
          new RegExp(
            `.*/api/Rettarvarsla/GetDocumentListById/${originalAncestorCaseId}`,
          ),
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
        json: () => [
          { rvMalSkjolMals_ID: 'Id 1', heitiSkjals: 'Name 1' },
          { rvMalSkjolMals_ID: 'Id 2', heitiSkjals: 'Name 2' },
        ],
      })

      then = await givenWhenThen(uuid(), theUser, theCase)
    })

    it('should return police case files', () => {
      expect(then.result).toEqual([
        { id: 'Id 1', name: 'Name 1' },
        { id: 'Id 2', name: 'Name 2' },
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
        `No police case files found for case ${originalAncestorCaseId}`,
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

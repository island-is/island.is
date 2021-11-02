import fetch from 'isomorphic-fetch'
import { uuid } from 'uuidv4'

import { BadGatewayException, NotFoundException } from '@nestjs/common'

import { PoliceCaseFile } from '../models'
import { createTestingPoliceModule } from './createTestingPoliceModule'

jest.mock('isomorphic-fetch')

interface Then {
  result: PoliceCaseFile[]
  error: Error
}

type GivenWhenThen = (caseId: string) => Promise<Then>

describe('PoliceController - Get all', () => {
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { policeController } = await createTestingPoliceModule()

    givenWhenThen = async (caseId: string): Promise<Then> => {
      const then = {} as Then

      await policeController
        .getAll(caseId)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('remote call', () => {
    const caseId = uuid()

    beforeEach(async () => {
      await givenWhenThen(caseId)
    })

    it('should request police files for the correct case', () =>
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(
          new RegExp(`.*/api/Rettarvarsla/GetDocumentListById/${caseId}`),
        ),
        expect.anything(),
      ))
  })

  describe('police files found', () => {
    const caseId = uuid()
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

      then = await givenWhenThen(caseId)
    })

    it('should return police case files', () => {
      expect(then.result).toEqual([
        { id: 'Id 1', name: 'Name 1' },
        { id: 'Id 2', name: 'Name 2' },
      ])
    })
  })

  describe('police files not found', () => {
    const caseId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({ ok: false })

      then = await givenWhenThen(caseId)
    })

    it('should throw not found exception', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(
        `No police case files found for case ${caseId}`,
      )
    })
  })

  describe('remote call fails', () => {
    const caseId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId)
    })

    it('should throw bad gateway exception', () => {
      expect(then.error).toBeInstanceOf(BadGatewayException)
      expect(then.error.message).toBe(
        `Failed to get police case files for case ${caseId}`,
      )
    })
  })
})

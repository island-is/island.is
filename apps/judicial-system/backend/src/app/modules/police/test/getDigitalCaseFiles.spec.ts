import fetch from 'isomorphic-fetch'
import { v4 as uuid } from 'uuid'

import { User } from '@island.is/judicial-system/types'

import { createTestingPoliceModule } from './createTestingPoliceModule'

import { Case } from '../../repository'
import { PoliceSystemDigitalCaseFile } from '../models/PoliceSystemDigitalCaseFile.model'

jest.mock('isomorphic-fetch')

interface Then {
  result: PoliceSystemDigitalCaseFile[]
  error?: Error
}

type GivenWhenThen = (
  caseId: string,
  user: User,
  theCase: Case,
) => Promise<Then>

describe('PoliceController - Get digital case files', () => {
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { policeController } = await createTestingPoliceModule()

    givenWhenThen = async (
      caseId: string,
      user: User,
      theCase: Case,
    ): Promise<Then> => {
      const then: Then = { result: [] }

      await policeController
        .getDigitalCaseFiles(caseId, user, theCase)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('when all metadata fields are present', () => {
    const theUser = {} as User
    const theCase = {} as Case
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            malsnumer: '007-2026-000007',
            gogn: [
              {
                id: '1723e662-6514-4aab-9b03-6b7778939a47',
                rvMalID: 766,
                fullName: 'John Doe',
                externalVendorFileName: 'Recording 1',
                externalVendorID: '2359',
                registeredAt: '2026-04-17T12:19:21.537',
              },
            ],
          },
        ],
      })

      then = await givenWhenThen(uuid(), theUser, theCase)
    })

    it('should prepend all supported metadata to the filename', () => {
      expect(then.result).toEqual([
        {
          id: '1723e662-6514-4aab-9b03-6b7778939a47',
          name: '007-2026-000007, John Doe, Recording 1',
          policeCaseNumber: '007-2026-000007',
          policeExternalVendorId: '2359',
          displayDate: new Date('2026-04-17T12:19:21.537'),
        },
      ])
    })
  })

  describe('when optional metadata fields are missing', () => {
    const theUser = {} as User
    const theCase = {} as Case
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            malsnumer: '007-2026-000007',
            gogn: [
              {
                id: '6cab5177-bfa7-4998-8c09-b4884fca0ae6',
                rvMalID: 766,
                fullName: null,
                externalVendorFileName: 'Recording 2',
                externalVendorID: '2360',
                registeredAt: '2026-04-17T12:19:22.130',
              },
              {
                id: 'ea4ccb3d-9670-4e3c-81f8-b63fb69c51e6',
                rvMalID: 766,
                externalVendorFileName: 'Recording 3',
                externalVendorID: '2361',
                registeredAt: null,
              },
            ],
          },
        ],
      })

      then = await givenWhenThen(uuid(), theUser, theCase)
    })

    it('should omit missing fields and avoid extra separators', () => {
      expect(then.result).toEqual([
        {
          id: '6cab5177-bfa7-4998-8c09-b4884fca0ae6',
          name: '007-2026-000007, Recording 2',
          policeCaseNumber: '007-2026-000007',
          policeExternalVendorId: '2360',
          displayDate: new Date('2026-04-17T12:19:22.130'),
        },
        {
          id: 'ea4ccb3d-9670-4e3c-81f8-b63fb69c51e6',
          name: '007-2026-000007, Recording 3',
          policeCaseNumber: '007-2026-000007',
          policeExternalVendorId: '2361',
          displayDate: undefined,
        },
      ])
    })
  })

  describe('when optional metadata fields only contain whitespace', () => {
    const theUser = {} as User
    const theCase = {} as Case
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            malsnumer: '007-2026-000007',
            gogn: [
              {
                id: '4bdc60ee-8d39-49b1-a0bc-dad2feb4c490',
                rvMalID: 766,
                fullName: '\t',
                externalVendorFileName: '  Recording 4  ',
                externalVendorID: '2362',
                registeredAt: '2026-04-17T12:19:20.787',
              },
            ],
          },
        ],
      })

      then = await givenWhenThen(uuid(), theUser, theCase)
    })

    it('should trim values and skip whitespace-only metadata fields', () => {
      expect(then.result).toEqual([
        {
          id: '4bdc60ee-8d39-49b1-a0bc-dad2feb4c490',
          name: '007-2026-000007, Recording 4',
          policeCaseNumber: '007-2026-000007',
          policeExternalVendorId: '2362',
          displayDate: new Date('2026-04-17T12:19:20.787'),
        },
      ])
    })
  })

  describe('when police case number contains surrounding whitespace', () => {
    const theUser = {} as User
    const theCase = {} as Case
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            malsnumer: ' 007-2026-000007 ',
            gogn: [
              {
                id: '6fd92208-b460-4f60-ae5c-d8d6f9d4f42d',
                rvMalID: 766,
                fullName: null,
                externalVendorFileName: 'Recording 5',
                externalVendorID: '2363',
                registeredAt: null,
              },
            ],
          },
        ],
      })

      then = await givenWhenThen(uuid(), theUser, theCase)
    })

    it('should trim and prepend the police case number without extra separators', () => {
      expect(then.result).toEqual([
        {
          id: '6fd92208-b460-4f60-ae5c-d8d6f9d4f42d',
          name: '007-2026-000007, Recording 5',
          policeCaseNumber: ' 007-2026-000007 ',
          policeExternalVendorId: '2363',
          displayDate: undefined,
        },
      ])
    })
  })
})

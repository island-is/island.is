import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import { User } from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { Case } from '../../../repository'
import { SignedUrl } from '../../models/signedUrl.model'
import { PoliceDigitalCaseFileService } from '../../policeDigitalCaseFiles/policeDigitalCaseFile.service'

interface Then {
  result: SignedUrl
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  user: User,
  theCase: Case,
  policeDigitalFileId: string,
) => Promise<Then>

describe('FileController - Get police digital case file token url', () => {
  let mockPoliceDigitalCaseFileService: PoliceDigitalCaseFileService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { policeDigitalCaseFileService, fileController } =
      await createTestingFileModule()

    mockPoliceDigitalCaseFileService = policeDigitalCaseFileService

    givenWhenThen = async (
      caseId: string,
      user: User,
      theCase: Case,
      policeDigitalFileId: string,
    ): Promise<Then> => {
      const then = {} as Then

      // The handler rejects a missing file id synchronously, before any
      // promise exists, so a then/catch chain would not see it
      try {
        then.result = await fileController.getPoliceDigitalCaseFileTokenUrl(
          caseId,
          user,
          theCase,
          policeDigitalFileId,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('token url fetched', () => {
    const caseId = uuid()
    const user = { id: uuid() } as User
    const theCase = {
      id: uuid(),
      courtCaseNumber: 'R-1/2026',
      policeCaseNumbers: ['007-2026-1'],
    } as Case
    const policeDigitalFileId = uuid()
    const url = 'https://police.example/token'
    let then: Then

    beforeEach(async () => {
      const mockGetTokenUrl =
        mockPoliceDigitalCaseFileService.getTokenUrl as jest.Mock
      mockGetTokenUrl.mockResolvedValueOnce(url)

      then = await givenWhenThen(caseId, user, theCase, policeDigitalFileId)
    })

    it('should ask for the resolved case, not the one in the url', () => {
      expect(mockPoliceDigitalCaseFileService.getTokenUrl).toHaveBeenCalledWith(
        theCase.id,
        user,
        policeDigitalFileId,
        {
          courtCaseNumber: theCase.courtCaseNumber,
          policeCaseNumbers: theCase.policeCaseNumbers,
        },
      )
      expect(then.result).toEqual({ url })
    })
  })

  describe('missing police digital file id', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(uuid(), {} as User, {} as Case, ' ')
    })

    it('should reject the request', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing policeDigitalFileId')
      expect(
        mockPoliceDigitalCaseFileService.getTokenUrl,
      ).not.toHaveBeenCalled()
    })
  })
})

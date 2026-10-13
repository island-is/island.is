import { v4 as uuid } from 'uuid'

import { CaseState, CaseType, User } from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { Case } from '../../../repository'
import { PoliceDigitalCaseFileSyncResult } from '../../models/policeDigitalCaseFileSyncResult.model'
import { PoliceDigitalCaseFileService } from '../../policeDigitalCaseFiles/policeDigitalCaseFile.service'

interface Then {
  result: PoliceDigitalCaseFileSyncResult[]
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  user: User,
  theCase: Case,
) => Promise<Then>

describe('FileController - Get police digital case files', () => {
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
    ): Promise<Then> => {
      const then = {} as Then

      await fileController
        .getPoliceDigitalCaseFiles(caseId, user, theCase)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('police digital case files synced', () => {
    // The url names the case the user is looking at. By the time the handler
    // runs the interceptor has replaced it with the original ancestor, which
    // is the case the police digital case files belong to.
    const caseId = uuid()
    const user = { id: uuid() } as User
    const theCase = {
      id: uuid(),
      type: CaseType.CUSTODY,
      state: CaseState.RECEIVED,
      courtCaseNumber: 'R-1/2026',
      withCourtSessions: false,
      prosecutor: { name: 'Saksóknari' },
      policeCaseNumbers: ['007-2026-1'],
    } as Case
    const files = [{ id: uuid() }] as PoliceDigitalCaseFileSyncResult[]
    let then: Then

    beforeEach(async () => {
      const mockSync =
        mockPoliceDigitalCaseFileService.syncAndGetPoliceDigitalCaseFiles as jest.Mock
      mockSync.mockResolvedValueOnce(files)

      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should sync against the resolved case, not the one in the url', () => {
      expect(
        mockPoliceDigitalCaseFileService.syncAndGetPoliceDigitalCaseFiles,
      ).toHaveBeenCalledWith(
        theCase.id,
        theCase.type,
        theCase.state,
        theCase.courtCaseNumber,
        theCase.withCourtSessions,
        theCase.prosecutor?.name,
        theCase.policeCaseNumbers,
        user,
      )
      expect(then.result).toBe(files)
    })
  })
})

import fetch from 'isomorphic-fetch'
import { uuid } from 'uuidv4'

import { UploadPoliceCaseFileResponse } from '../models'
import { createTestingPoliceModule } from './createTestingPoliceModule'

jest.mock('isomorphic-fetch')

interface Then {
  result: UploadPoliceCaseFileResponse
  error: Error
}

type GivenWhenThen = (policeFileId: string) => Promise<Then>

describe('PoliceController - Upload police case file', () => {
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const policeController = await createTestingPoliceModule()

    givenWhenThen = async (policeFileId: string): Promise<Then> => {
      const then = {} as Then

      await policeController
        .uploadPoliceCaseFile(policeFileId)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('remote police call', () => {
    const policeFileId = uuid()

    beforeEach(async () => {
      givenWhenThen(policeFileId)
    })
    it('should get the police file', () => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(
          new RegExp(`.*/api/Documents/GetPDFDocumentByID/${policeFileId}`),
        ),
        expect.anything(),
      )
    })
  })
})

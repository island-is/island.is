import { uuid } from 'uuidv4'
import fetch from 'node-fetch'

import { CaseFileState } from '@island.is/judicial-system/types'

import { appModuleConfig } from '../app.config'
import { CaseFilesUploadService } from '../caseFilesUpload.service'

jest.mock('@island.is/logging')
jest.mock('node-fetch')

describe('CaseFilesUploadService - upload case files to court', () => {
  const config = appModuleConfig()
  const caseId = uuid()
  const caseFileId1 = uuid()
  const caseFileId2 = uuid()

  beforeAll(async () => {
    const mockFetch = (fetch as unknown) as jest.Mock
    mockFetch.mockResolvedValueOnce(
      Promise.resolve({
        ok: true,
        json: () => [
          { id: caseFileId1, state: CaseFileState.STORED_IN_RVG },
          { id: caseFileId2, state: CaseFileState.STORED_IN_COURT },
        ],
      }),
    )

    const caseFilesUploadService = new CaseFilesUploadService(config)
    await caseFilesUploadService.uploadCaseFilesToCourt(caseId)
  })

  it('should get all case files', () => {
    expect(fetch).toHaveBeenCalledWith(
      `${config.backendUrl}/api/internal/case/${caseId}/files`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${config.backendAccessToken}`,
        },
      },
    )
  })

  it('should upload the first case file', () => {
    expect(fetch).toHaveBeenCalledWith(
      `${config.backendUrl}/api/internal/case/${caseId}/file/${caseFileId1}/court`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${config.backendAccessToken}`,
        },
      },
    )
  })

  it('should not upload the second case file', () => {
    expect(fetch).not.toHaveBeenCalledWith(
      `${config.backendUrl}/api/internal/case/${caseId}/file/${caseFileId2}/court`,
      expect.anything(),
    )
  })
})

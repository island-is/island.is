import type { User } from '@island.is/auth-nest-tools'
import { PrimarySchoolClientService } from './primarySchoolClient.service'
import { getV1IslandisassignmentresultsByStudentIdResultByAssignmentResultIdPdf } from '../../gen/fetch'

jest.mock('../../gen/fetch', () => ({
  getV1IslandisassignmentresultsByStudentIdResultByAssignmentResultIdPdf:
    jest.fn(),
}))

const mockedSdkCall =
  getV1IslandisassignmentresultsByStudentIdResultByAssignmentResultIdPdf as jest.Mock

const user = { nationalId: '1234567890' } as User

describe('PrimarySchoolClientService.getAssignmentResultPdf', () => {
  let service: PrimarySchoolClientService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new PrimarySchoolClientService()
  })

  it('calls the real SDK with the signal forwarded', async () => {
    const blob = new Blob(['pdf'])
    mockedSdkCall.mockResolvedValue({ data: blob })
    const signal = new AbortController().signal

    const result = await service.getAssignmentResultPdf(
      user,
      'student1',
      'result1',
      signal,
    )

    expect(result).toBe(blob)
    expect(mockedSdkCall).toHaveBeenCalledWith(
      expect.objectContaining({
        path: { studentId: 'student1', assignmentResultId: 'result1' },
        signal,
      }),
    )
  })
})

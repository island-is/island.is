import {
  ApplicationReportChannelEnum,
  ReportStatusEnum,
  ReportTypeEnum,
} from '@island.is/clients/directorate-of-equality'

import { mapSubmission, mapSubmissionStatus } from './mapper'
import {
  DirectorateOfEqualitySubmissionChannel,
  DirectorateOfEqualitySubmissionStatus,
  DirectorateOfEqualitySubmissionType,
} from './models/enums'

describe('mapSubmissionStatus', () => {
  it.each([
    [ReportStatusEnum.DRAFT, DirectorateOfEqualitySubmissionStatus.IN_REVIEW],
    [
      ReportStatusEnum.SUBMITTED,
      DirectorateOfEqualitySubmissionStatus.IN_REVIEW,
    ],
    [
      ReportStatusEnum.POSTPONED,
      DirectorateOfEqualitySubmissionStatus.IN_REVIEW,
    ],
    [
      ReportStatusEnum.IN_REVIEW,
      DirectorateOfEqualitySubmissionStatus.IN_REVIEW,
    ],
    [ReportStatusEnum.APPROVED, DirectorateOfEqualitySubmissionStatus.APPROVED],
    [ReportStatusEnum.DENIED, DirectorateOfEqualitySubmissionStatus.REJECTED],
    [
      ReportStatusEnum.SUPERSEDED,
      DirectorateOfEqualitySubmissionStatus.SUPERSEDED,
    ],
    [
      ReportStatusEnum.WITHDRAWN,
      DirectorateOfEqualitySubmissionStatus.WITHDRAWN,
    ],
  ])('maps %s to %s', (status, expected) => {
    expect(mapSubmissionStatus(status)).toBe(expected)
  })
})

describe('mapSubmission', () => {
  it('maps a partner-filed salary report', () => {
    const submittedAt = new Date('2026-02-19T10:30:00.000Z')

    expect(
      mapSubmission({
        providerId: 'partner:abc',
        submittedVia: ApplicationReportChannelEnum.SERVICE_PROVIDER,
        importedFromExcel: true,
        type: ReportTypeEnum.SALARY,
        status: ReportStatusEnum.SUBMITTED,
        submittedAt,
        salaryDataPeriod: '2026-01-01',
      }),
    ).toEqual({
      id: 'partner:abc',
      type: DirectorateOfEqualitySubmissionType.SALARY_REPORT,
      status: DirectorateOfEqualitySubmissionStatus.IN_REVIEW,
      submittedVia: DirectorateOfEqualitySubmissionChannel.SERVICE_PROVIDER,
      identifier: null,
      submittedAt,
      approvedAt: null,
      validUntil: null,
      salaryDataPeriod: '2026-01-01',
    })
  })
})

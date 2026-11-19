import {
  ApplicationReportChannelEnum,
  ApplicationReportListItemDto,
  ReportStatusEnum,
  ReportTypeEnum,
} from '@island.is/clients/directorate-of-equality'

import {
  DirectorateOfEqualitySubmissionChannel,
  DirectorateOfEqualitySubmissionStatus,
  DirectorateOfEqualitySubmissionType,
} from './models/enums'
import { Submission } from './models/submission.model'

export const mapSubmissionType = (
  type: ReportTypeEnum,
): DirectorateOfEqualitySubmissionType =>
  type === ReportTypeEnum.EQUALITY
    ? DirectorateOfEqualitySubmissionType.EQUALITY_PLAN
    : DirectorateOfEqualitySubmissionType.SALARY_REPORT

export const mapSubmissionStatus = (
  status: ReportStatusEnum,
): DirectorateOfEqualitySubmissionStatus => {
  switch (status) {
    case ReportStatusEnum.APPROVED:
      return DirectorateOfEqualitySubmissionStatus.APPROVED
    case ReportStatusEnum.DENIED:
      return DirectorateOfEqualitySubmissionStatus.REJECTED
    case ReportStatusEnum.SUPERSEDED:
      return DirectorateOfEqualitySubmissionStatus.SUPERSEDED
    case ReportStatusEnum.WITHDRAWN:
      return DirectorateOfEqualitySubmissionStatus.WITHDRAWN
    default:
      return DirectorateOfEqualitySubmissionStatus.IN_REVIEW
  }
}

const mapSubmissionChannel = (
  channel: ApplicationReportChannelEnum,
): DirectorateOfEqualitySubmissionChannel => {
  switch (channel) {
    case ApplicationReportChannelEnum.SERVICE_PROVIDER:
      return DirectorateOfEqualitySubmissionChannel.SERVICE_PROVIDER
    case ApplicationReportChannelEnum.DIRECTORATE:
      return DirectorateOfEqualitySubmissionChannel.DIRECTORATE
    default:
      return DirectorateOfEqualitySubmissionChannel.ISLAND_IS
  }
}

export const mapSubmission = (
  report: ApplicationReportListItemDto,
): Submission => ({
  id: report.providerId,
  type: mapSubmissionType(report.type),
  status: mapSubmissionStatus(report.status),
  submittedVia: mapSubmissionChannel(report.submittedVia),
  identifier: report.identifier ?? null,
  submittedAt: report.submittedAt ?? null,
  approvedAt: report.approvedAt ?? null,
  validUntil: report.validUntil ?? null,
  salaryDataPeriod: report.salaryDataPeriod ?? null,
})

import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ApplicationWithAttachments,
} from '@island.is/application/types'
import {
  ReviewAddAttachmentData,
  ReviewApprovalEnum,
  SubmittedApplicationData,
  utils,
} from '@island.is/application/templates/iceland-health/accident-notification'
import { AccidentNotificationAttachmentStatus } from '../types/applicationStatus'
import {
  AccidentNotificationAttachment,
  AccidentNotificationAttachmentGatherRequest,
} from '../types/attachments'
import {
  additionalFilesRequest,
  allAttachmentRequestConfig,
  injuryCertificateRequest,
  policeReportRequest,
  powerOfAttorneyRequest,
  additionalFilesFromReviewerRequest,
} from '../config'
import { AccidentNotificationAttachmentProvider } from './applicationAttachmentProvider'
import { getApplicationDocumentId } from '../accident-notification.utils'

export const attachmentStatusToAttachmentRequests = (
  receivedAttachments?: AccidentNotificationAttachmentStatus,
): AccidentNotificationAttachmentGatherRequest[] => {
  if (!receivedAttachments) return allAttachmentRequestConfig.requests

  const attachmentRequests: AccidentNotificationAttachmentGatherRequest[] = []

  if (
    !receivedAttachments.InjuryCertificate &&
    receivedAttachments.InjuryCertificate != null
  ) {
    attachmentRequests.push(injuryCertificateRequest)
  }
  if (
    !receivedAttachments.ProxyDocument &&
    receivedAttachments.ProxyDocument != null
  ) {
    attachmentRequests.push(powerOfAttorneyRequest)
  }
  if (
    !receivedAttachments.PoliceReport &&
    receivedAttachments.PoliceReport != null
  ) {
    attachmentRequests.push(policeReportRequest)
  }
  if (!receivedAttachments.Unknown && receivedAttachments.Unknown != null) {
    attachmentRequests.push(additionalFilesRequest)
    attachmentRequests.push(additionalFilesFromReviewerRequest)
  }

  return attachmentRequests
}

export const getApplicationAttachmentStatus = (
  application: Application,
): AccidentNotificationAttachmentStatus => {
  const status = getValueViaPath(
    application.answers,
    'accidentStatus.recievedAttachments',
  ) as AccidentNotificationAttachmentStatus

  return status
}

export const getSentDocumentsHashList = (
  application: Application,
): string[] => {
  const subAppData = application.externalData
    .submitApplication as SubmittedApplicationData
  const submitSentDocuments = subAppData?.data?.sentDocuments ?? []

  const addAttachmentAppData = application.externalData
    .addAdditionalAttachment as ReviewAddAttachmentData
  const addAttachmentSentDocuments =
    addAttachmentAppData?.data?.sentDocuments ?? []
  return [...submitSentDocuments, ...addAttachmentSentDocuments]
}

export const filterOutAlreadySentDocuments = (
  attachments: AccidentNotificationAttachment[],
  application: Application,
): AccidentNotificationAttachment[] => {
  const sentDocumentsHashList = getSentDocumentsHashList(application)
  return attachments.filter((attachment) => {
    return !sentDocumentsHashList.includes(attachment.hash)
  })
}

export const getAddAttachmentSentDocumentHashList = (
  application: Application,
): string[] => {
  const addAttachmentAppData = application.externalData
    .addAdditionalAttachment as ReviewAddAttachmentData
  return addAttachmentAppData?.data?.sentDocuments ?? []
}

export const getReportId = (application: ApplicationWithAttachments) => {
  const externalData = application.externalData
  return getValueViaPath(
    externalData,
    'submitApplication.data.documentId',
  ) as number
}

export const getNewAttachments = async (
  application: ApplicationWithAttachments,
  attachmentProvider: AccidentNotificationAttachmentProvider,
) => {
  const attachmentStatus = getApplicationAttachmentStatus(application)
  const requests = attachmentStatusToAttachmentRequests(attachmentStatus)
  const attachments = await attachmentProvider.getFiles(requests, application)

  const newAttachments = filterOutAlreadySentDocuments(attachments, application)

  return newAttachments
}

export const getReviewApplicationData = (application: Application) => {
  const documentId = getApplicationDocumentId(application)

  const isRepresentativeOfCompanyOrInstitute =
    utils.isRepresentativeOfCompanyOrInstitute(application.answers)
  const reviewApproval = getValueViaPath(
    application.answers,
    'reviewApproval',
  ) as ReviewApprovalEnum
  const reviewComment =
    (getValueViaPath(application.answers, 'reviewComment') as string) || ''

  return {
    documentId,
    isRepresentativeOfCompanyOrInstitute,
    reviewApproval,
    reviewComment,
  }
}

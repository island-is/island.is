import { Application, getValueViaPath } from '@island.is/application/core'
import {
  ReviewAddAttachmentData,
  SubmittedApplicationData,
} from '@island.is/application/templates/accident-notification'
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
  const addAttachmentSentDocuments =
    addAttachmentAppData?.data?.sentDocuments ?? []

  return addAttachmentSentDocuments.map((x) => x)
}

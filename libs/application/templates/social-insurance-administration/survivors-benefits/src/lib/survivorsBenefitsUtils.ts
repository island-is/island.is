import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
} from '@island.is/application/types'
import {
  AttachmentLabel,
} from './constants'
import {
  FileType,
  Attachments,
  AdditionalInformation,
} from '../types'

enum AttachmentTypes {
  ADDITIONAL_DOCUMENTS = 'additionalDocuments',
}

export function getApplicationAnswers(answers: Application['answers']) {
  const comment = getValueViaPath(answers, 'comment') as string
  console.log('comment:', comment)
  const additionalAttachments = getValueViaPath(
    answers,
    'fileUploadAdditionalFiles.additionalDocuments',
  ) as FileType[]
  console.log('additionalAttachments: ', additionalAttachments)
  return {
    comment,
    additionalAttachments,
  }
}

export function getAttachments(application: Application) {
  const getAttachmentDetails = (
    attachmentsArr: FileType[] | undefined,
    attachmentType: AttachmentTypes,
  ) => {
    if (attachmentsArr && attachmentsArr.length > 0) {
      attachments.push({
        attachments: attachmentsArr,
        label: AttachmentLabel[attachmentType],
      })
    }
  }

  const { answers } = application

  const attachments: Attachments[] = []

  const additionalInfo =
    answers.fileUploadAdditionalFiles as AdditionalInformation

  const additionalDocuments = [
    ...(additionalInfo.additionalDocuments &&
    additionalInfo.additionalDocuments?.length > 0
      ? additionalInfo.additionalDocuments
      : []),
    ...(additionalInfo.additionalDocumentsRequired &&
    additionalInfo.additionalDocumentsRequired?.length > 0
      ? additionalInfo.additionalDocumentsRequired
      : []),
  ]

  if (additionalDocuments.length > 0) {
    getAttachmentDetails(
      additionalDocuments,
      AttachmentTypes.ADDITIONAL_DOCUMENTS,
    )
  }

  return attachments
}

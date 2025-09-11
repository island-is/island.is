import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  CancelContract,
  TerminateContract,
  TerminationReason,
} from '@island.is/clients/hms-rental-agreement'
import { AttachmentData } from '../../../shared/services/attachment-s3.service'

export const isCancellation = (application: Application) => {
  const terminationType = getValueViaPath<string>(
    application.answers,
    'terminationType.answer',
  )

  return terminationType === 'cancelation'
}

export const parseCancelContract = (
  application: Application,
  files: Array<AttachmentData>,
): CancelContract => {
  if (files.length === 0) {
    throw new Error('No files found')
  }

  const obj = {
    contractId:
      getValueViaPath<string>(application.answers, 'rentalAgreement.answer') ??
      '',
    cancelOn: new Date(
      getValueViaPath<string>(
        application.answers,
        'cancelation.cancelationDate',
      ) ?? '',
    ),
    document: files[0].fileContent,
    documentMime: files[0].fileName.split('.').pop() ?? 'pdf',
    documentFilename: truncateMiddle(files[0].fileName, 40),
  }

  return obj
}

export const parseTerminateContract = (
  application: Application,
  files: Array<AttachmentData>,
): TerminateContract => {
  const terminationReason =
    getValueViaPath<string>(
      application.answers,
      'unboundTermination.unboundTerminationReason',
    ) ?? ''

  const boundTerminationDate =
    getValueViaPath<Date>(
      application.answers,
      'boundTermination.boundTerminationDate',
    ) ?? null
  const unboundTerminationDate =
    getValueViaPath<Date>(
      application.answers,
      'unboundTermination.unboundTerminationDate',
    ) ?? null

  const obj = {
    contractId:
      getValueViaPath<string>(application.answers, 'rentalAgreement.answer') ??
      '',
    terminateOn: (boundTerminationDate || unboundTerminationDate) ?? new Date(),
    reasonUseCode:
      (terminationReason as TerminationReason) ??
      TerminationReason.OWNERINBUILDING,
    document: files[0].fileContent,
    documentMime: files[0].fileName.split('.').pop() ?? 'pdf',
    documentFilename: truncateMiddle(files[0].fileName, 40),
  }

  return obj
}

export const truncateMiddle = (
  str: string,
  maxLength: number,
  separator = '-',
): string => {
  if (str.length <= maxLength) return str

  const separatorLength = separator.length
  const charsToShow = maxLength - separatorLength
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)

  return str.slice(0, frontChars) + separator + str.slice(-backChars)
}

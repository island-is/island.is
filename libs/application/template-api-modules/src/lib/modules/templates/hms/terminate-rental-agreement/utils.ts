import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  CancelContract,
  TerminateContract,
  TerminationReason,
} from '@island.is/clients/hms-rental-agreement'
import { AttachmentData } from '../../../shared/services/attachment-s3.service'

const terminationReasonMap: Record<string, TerminationReason> = {
  'Leigusali býr í sama húsnæði': TerminationReason.OWNERINBUILDING,
  'Húsnæði er leigt út með húsgögnum': TerminationReason.FURNISHEDRENT,
  'Leigusali tekur húsnæðið til eigin nota': TerminationReason.OWNERTAKINGBACK,
  'Leigusali ráðstafar húsnæði til skyldmenna':
    TerminationReason.OWNERRELATIVES,
  'Leigusali hyggst selja húsnæðið á næstu 6 mánuðum':
    TerminationReason.OWNERSELLING,
  'Fyrirhugaðar eru verulegar viðgerðir á húsnæði':
    TerminationReason.SIGNIFICANTREPAIRS,
  'Leigjandi var starfsmaður leigusala og hefur látið af störfum':
    TerminationReason.TENANTEMPLOYEE,
  'Leigjandi hefur gerst sekur um vanefndir eða brot sem varða riftun':
    TerminationReason.TENANTNONCOMPLIANCE,
  'Leigjandi hefur á annan hátt vanefnt skyldur sínar':
    TerminationReason.TENANTBEHAVIOR,
  'Sanngjarnt mat á hagsmunum og aðstæðum réttlætir uppsögn':
    TerminationReason.BOTHPARTIESINTERESTS,
  'Leigusali er lögaðili sem er ekki rekinn í hagnaðarskyni og leigjandi uppfyllir ekki lengur skilyrði fyrir leigu':
    TerminationReason.NONPROFITTENANT,
}

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

  const obj = {
    contractId:
      getValueViaPath<string>(application.answers, 'rentalAgreement.answer') ??
      '',
    terminateOn:
      getValueViaPath<Date>(
        application.answers,
        'boundTermination.boundTerminationDate',
      ) ?? new Date(),
    reasonUseCode:
      terminationReasonMap[terminationReason] ??
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

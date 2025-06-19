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

export const isCancelation = (application: Application) => {
  const terminationType = getValueViaPath<string>(
    application.answers,
    'terminationType',
  )

  return terminationType === 'cancelation'
}

export const parseCancelContract = (
  application: Application,
  files: Array<AttachmentData>,
): CancelContract => {
  const obj = {
    contractId:
      getValueViaPath<string>(application.answers, 'rentalAgreement') ?? '',
    cancelOn: new Date(
      getValueViaPath<string>(application.answers, 'cancelationDate') ?? '',
    ),
    document: files[0].fileContent,
    documentMime: files[0].fileName.split('.').pop() ?? 'pdf',
    documentFilename: files[0].fileName,
  }

  return obj
}

export const parseTerminateContract = (
  application: Application,
  files: Array<AttachmentData>,
): TerminateContract => {
  const terminationReason =
    getValueViaPath<string>(application.answers, 'unboundTerminationReason') ??
    ''

  const obj = {
    contractId:
      getValueViaPath<string>(application.answers, 'rentalAgreement') ?? '',
    terminateOn:
      getValueViaPath<Date>(application.answers, 'terminationDate') ??
      new Date(),
    reasonUseCode: terminationReasonMap[terminationReason] ?? '',
    document: files[0].fileContent,
    documentMime: files[0].fileName.split('.').pop() ?? 'pdf',
    documentFilename: files[0].fileName,
  }

  return obj
}

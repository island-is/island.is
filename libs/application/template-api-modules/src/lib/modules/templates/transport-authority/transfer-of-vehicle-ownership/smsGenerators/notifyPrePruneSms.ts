import { SmsMessage } from '../../../../../types'
import { EmailRecipient } from '../types'
import { Application } from '@island.is/application/types'
import { TransferOfVehicleOwnershipAnswers } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'
import {
  getRoleNameById,
  getApplicationPruneDateStr,
} from '../transfer-of-vehicle-ownership.utils'

export type NotifyPrePruneSms = (
  application: Application,
  recipient: EmailRecipient,
) => SmsMessage

export const generateNotifyPrePruneSms: NotifyPrePruneSms = (
  application,
  recipient,
) => {
  const answers = application.answers as TransferOfVehicleOwnershipAnswers
  const permno = answers?.vehicle?.plate
  const notApprovedByList: EmailRecipient[] = [] //TODOx get list of recipient that have not approved

  if (!recipient.phone) throw new Error('Recipient phone was undefined')
  if (!permno) throw new Error('Permno was undefined')

  const pruneDateStr = getApplicationPruneDateStr(application.created)
  const notApprovedByListStr = notApprovedByList
    .map(
      (notApprovedBy) =>
        `${notApprovedBy.name}, kt. ${notApprovedBy.ssn} (${getRoleNameById(
          notApprovedBy.role,
        )}). `,
    )
    .join(',')

  return {
    phoneNumber: recipient.phone || '',
    message:
      `Ertu nokkuð að gleyma þér? ` +
      `Á morgun ${pruneDateStr} mun beiðni um eigendaskipti fyrir ökutækið ${permno} falla niður þar sem eftirfarandi aðilar hafa ekki samþykkt: ` +
      `${notApprovedByListStr}. ` +
      '. ' +
      `Hægt er að samþykkja beiðnina á island.is/umsoknir.`,
  }
}

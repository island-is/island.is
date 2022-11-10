import { TransferOfVehicleOwnershipAnswers } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'
import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../../types'
import { EmailRecipient } from '../types'
import {
  getRoleNameById,
  getApplicationPruneDateStr,
} from '../transfer-of-vehicle-ownership.utils'

export type NotifyPrePruneEmail = (
  props: EmailTemplateGeneratorProps,
  recipient: EmailRecipient,
) => Message

export const generateNotifyPrePruneEmail: NotifyPrePruneEmail = (
  props,
  recipient,
): Message => {
  const {
    application,
    options: { email },
  } = props
  const answers = application.answers as TransferOfVehicleOwnershipAnswers
  const permno = answers?.vehicle?.plate
  const notApprovedByList: EmailRecipient[] = [] //TODOx get list of recipient that have not approved

  if (!recipient.email) throw new Error('Recipient email was undefined')
  if (!permno) throw new Error('Permno was undefined')

  const subject = 'Tilkynning um eigendaskipti - Ertu nokkuð að gleyma þér?'
  const pruneDateStr = getApplicationPruneDateStr(application.created)
  const notApprovedByListStr = notApprovedByList
    .map(
      (notApprovedBy) =>
        `<li><p>${notApprovedBy.name}, kt. ${
          notApprovedBy.ssn
        } (${getRoleNameById(notApprovedBy.role)})</p></li>`,
    )
    .join(',')

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [{ name: recipient.name, address: recipient.email }],
    subject,
    template: {
      title: subject,
      body: [
        {
          component: 'Copy',
          context: {
            copy:
              `<p>Góðan dag,</p><br/>` +
              `<p>Ert þú nokkuð að gleyma þér?</p>` +
              `<p>Á morgun ${pruneDateStr} mun beiðni um eigendaskipti fyrir ökutækið ${permno} falla niður þar sem eftirfarandi aðilar hafa ekki samþykkt:</p>` +
              `<ul>${notApprovedByListStr}.</ul>` +
              `<p>Hægt er að samþykkja beiðnina á island.is/umsoknir.</p>`,
          },
        },
      ],
    },
  }
}

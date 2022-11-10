import { TransferOfVehicleOwnershipAnswers } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'
import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../../types'
import { EmailRecipient } from '../types'
import { getApplicationPruneDateStr } from '../transfer-of-vehicle-ownership.utils'

export type RequestReviewEmail = (
  props: EmailTemplateGeneratorProps,
  recipient: EmailRecipient,
) => Message

export const generateRequestReviewEmail: RequestReviewEmail = (
  props,
  recipient,
): Message => {
  const {
    application,
    options: { email },
  } = props
  const answers = application.answers as TransferOfVehicleOwnershipAnswers
  const permno = answers?.vehicle?.plate

  if (!recipient.email) throw new Error('Recipient email was undefined')
  if (!permno) throw new Error('Permno was undefined')

  const subject = 'Tilkynning um eigendaskipti - Vantar samþykki'
  const pruneDateStr = getApplicationPruneDateStr(application.created)

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
              `<p>Þín bíður ósamþykkt beiðni um eigendaskipti fyrir ökutækið ${permno} á island.is.</p>` +
              `<p>Til þess að samþykkja beiðnina skráir þú þig inn á island.is/umsóknir.</p>` +
              `<p>Þú hefur 7 daga til þess að samþykkja beiðnina.</p>` +
              `<p>Ef eigendaskiptin hafa ekki verið samþykkt fyrir ${pruneDateStr} munu þau falla niður.</p>`,
          },
        },
      ],
    },
  }
}

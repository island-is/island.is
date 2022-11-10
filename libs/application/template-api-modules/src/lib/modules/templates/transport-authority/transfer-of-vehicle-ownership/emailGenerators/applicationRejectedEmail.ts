import { TransferOfVehicleOwnershipAnswers } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'
import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../../types'
import { EmailRecipient } from '../types'
import { getRoleNameById } from '../transfer-of-vehicle-ownership.utils'

export type ApplicationRejectedEmail = (
  props: EmailTemplateGeneratorProps,
  recipient: EmailRecipient,
  rejectedBy: EmailRecipient | undefined,
) => Message

export const generateApplicationRejectedEmail: ApplicationRejectedEmail = (
  props,
  recipient,
  rejectedBy,
): Message => {
  const {
    application,
    options: { email },
  } = props
  const answers = application.answers as TransferOfVehicleOwnershipAnswers
  const permno = answers?.vehicle?.plate

  if (!recipient.email) throw new Error('Recipient email was undefined')
  if (!permno) throw new Error('Permno was undefined')
  if (!rejectedBy?.ssn) throw new Error('Rejected by ssn was undefined')

  const subject = 'Tilkynning um eigendaskipti - Umsókn afturkölluð'
  const rejectedByStr = `${rejectedBy.name}, kt. ${
    rejectedBy.ssn
  } (${getRoleNameById(rejectedBy.role)})`

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
              `Góðan dag. Beiðni um eigendaskipti á ökutækinu ${permno} hefur verið afturkölluð þar sem eftirfarandi aðilar staðfestu ekki: ` +
              `${rejectedByStr}. ` +
              `Til þess að skrá eigendaskiptin rafrænt verður að byrja ferlið að upp á nýtt á umsóknarvef island.is: island.is/umsoknir, ` +
              `ásamt því að allir aðilar þurfa að staðfesta rafrænt innan gefins tímafrests. ` +
              `Þessi tilkynning á aðeins við um rafræna umsókn af umsóknarvef island.is en ekki um eigendaskipti sem skilað hefur verið inn til Samgöngustofu á pappír. ` +
              `Vinsamlegast hafið samband við Þjónustuver Samgöngustofu (afgreidsla@samgongustofa.is) ef nánari upplýsinga er þörf. `,
          },
        },
      ],
    },
  }
}

import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../../types'
import { EmailRecipient } from '../types'
import { ChangeMachineSupervisorAnswers } from '@island.is/application/templates/aosh/change-machine-supervisor'

export type ApplicationSubmittedEmail = (
  props: EmailTemplateGeneratorProps,
  recipient: EmailRecipient,
  supervisorName: string,
) => Message

export const generateApplicationSubmittedEmail: ApplicationSubmittedEmail = (
  props,
  recipient,
  supervisorName,
): Message => {
  const {
    application,
    options: { email },
  } = props
  const answers = application.answers as ChangeMachineSupervisorAnswers
  const regNumber = answers?.machine.regNumber

  if (!recipient.email) throw new Error('Recipient email was undefined')
  if (!regNumber) throw new Error('Registration number was undefined')

  const subject =
    'Tilkynning um umráðaskipti - Nýr umráðamaður hefur verið skráður'

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
          component: 'Heading',
          context: { copy: subject },
        },
        {
          component: 'Copy',
          context: {
            copy:
              `<span>Góðan dag,</span><br/><br/>` +
              `<span>Umráðaskipti fyrir tækið ${regNumber} hafa verið skráð.</span><br/>` +
              `<span>${supervisorName} er nú skráður sem nýr umráðamaður.</span>`,
          },
        },
      ],
    },
  }
}

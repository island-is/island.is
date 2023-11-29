import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../../types'
import { ApplicationConfigurations } from '@island.is/application/types'
import {
  getApplicationPruneDateStr,
  pathToAsset,
} from '../change-machine-supervisor.utils'
import { EmailRecipient } from '../types'
import { getValueViaPath } from '@island.is/application/core'
import { TransferOfMachineOwnerShipAnswers } from '@island.is/application/templates/aosh/transfer-of-machine-ownership'

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
    options: { email, clientLocationOrigin },
  } = props
  const answers = application.answers as TransferOfMachineOwnerShipAnswers
  const regNumber = getValueViaPath(answers, 'machine.regNumber') as string

  if (!recipient.email) throw new Error('Recipient email was undefined')
  if (!regNumber) throw new Error('Registration Number was undefined')

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
          component: 'Image',
          context: {
            src: pathToAsset('logo.jpg'),
            alt: 'Ísland.is logo',
          },
        },
        {
          component: 'Image',
          context: {
            src: pathToAsset('computerIllustration.jpg'),
            alt: 'Kaffi við skjá myndskreyting',
          },
        },
        {
          component: 'Heading',
          context: { copy: subject },
        },
        {
          component: 'Copy',
          context: {
            copy:
              `<span>Góðan dag,</span><br/><br/>` +
              `<span>Þín bíður ósamþykkt beiðni um eigendaskipti fyrir tækið ${regNumber} á island.is.</span><br/>` +
              `<span>Þú hefur 7 daga til þess að samþykkja beiðnina.</span><br/>` +
              `<span>Ef eigendaskiptin hafa ekki verið samþykkt fyrir ${pruneDateStr} munu þau falla niður.</span><br/>` +
              `<span>Hægt er að fara yfir beiðnina á island.is eða með því að smella á hlekkinn hér fyrir neðan.</span><br/>`,
          },
        },
        {
          component: 'Button',
          context: {
            copy: 'Skoða umsókn',
            href: `${clientLocationOrigin}/${ApplicationConfigurations.TransferOfMachineOwnership.slug}/${application.id}`,
          },
        },
      ],
    },
  }
}

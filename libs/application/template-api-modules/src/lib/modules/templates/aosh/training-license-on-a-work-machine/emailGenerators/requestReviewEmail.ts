import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../../types'
import { ApplicationConfigurations } from '@island.is/application/types'
import {
  getApplicationPruneDateStr,
  pathToAsset,
} from '../training-license-on-a-work-machine.utils'
import { EmailRecipient } from '../types'

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
  if (!recipient.email) throw new Error('Recipient email was undefined')

  const subject = 'Kennsluréttindi á vinnuvél - Vantar samþykki'
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
              `<span>Þín bíður beiðni um samþykki á starfstíma á vinnuvél á island.is/umsoknir.</span><br/>` +
              `<span>Þú hefur 7 daga til þess að samþykkja beiðnina.</span><br/>` +
              `<span>Ef starfstími á vinnuvél hefur ekki verið samþykkt fyrir ${pruneDateStr} munu umsókn eyðast og ferlið ekki ná til Vinnueftirlitsins.</span><br/>` +
              `<span>Hægt er að fara yfir beiðnina á island.is eða með því að smella á hlekkinn hér fyrir neðan.</span><br/>`,
          },
        },
        {
          component: 'Button',
          context: {
            copy: 'Skoða umsókn',
            href: `${clientLocationOrigin}/${ApplicationConfigurations.TrainingLicenseOnAWorkMachine.slug}/${application.id}`,
          },
        },
      ],
    },
  }
}

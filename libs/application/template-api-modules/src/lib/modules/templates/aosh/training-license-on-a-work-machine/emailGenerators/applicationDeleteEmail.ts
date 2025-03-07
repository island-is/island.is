import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../../types'
import { EmailRecipient } from '../types'
import { pathToAsset } from '../training-license-on-a-work-machine.utils'

export type ApplicationDeleteEmail = (
  props: EmailTemplateGeneratorProps,
  recipient: EmailRecipient,
) => Message

export const generateApplicationDeleteEmail: ApplicationDeleteEmail = (
  props,
  recipient,
): Message => {
  const {
    options: { email },
  } = props

  if (!recipient.email) throw new Error('Recipient email was undefined')

  const subject = 'Kennsluréttindi á vinnuvél - Umsókn afturkölluð'

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
              `<span>Beiðni um samþykkt á starfstíma á vinnuvél hefur verið afturkölluð þar sem umsækjandi eyddi umsókninni.</span><br/>` +
              `<span>Til þess að skrá kennsluréttindi á vinnuvél rafrænt verður að byrja ferlið upp á nýtt á umsóknarvef island.is: island.is/umsoknir, ásamt því að allir aðilar þurfa að staðfesta rafrænt innan gefins tímafrests.</span><br/>` +
              `<span>Vinsamlegast hafið samband við Vinnueftirlitið vinnueftirlit@ver.is ef nánari upplýsinga er þörf.</span>`,
          },
        },
      ],
    },
  }
}

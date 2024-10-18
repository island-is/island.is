import { Message } from '@island.is/email-service'
import { EmailRecipient } from '../types'
import { ApplicationConfigurations } from '@island.is/application/types'
import { EmailTemplateGeneratorProps } from '../../../../types'
import { pathToAsset } from '../utils'

export type ApplicationSubmittedEmail = (
  props: EmailTemplateGeneratorProps,
  recipient: EmailRecipient,
) => Message

export const generateApplicationSubmittedEmail: ApplicationSubmittedEmail = (
  props,
  recipient,
): Message => {
  const {
    application,
    options: { email, clientLocationOrigin },
  } = props

  if (!recipient.email) throw new Error('Recipient email was undefined')

  const subject = 'Umsókn um nafnskírteini - Búið er að skrá beiðni'

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
            src: pathToAsset('notification.jpg'),
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
              `<span>Allir aðilar samþykktu inn á island.is/umsoknir og búið er að greiða fyrir nafnskírteinið.</span>`,
          },
        },
        {
          component: 'Button',
          context: {
            copy: 'Skoða umsókn',
            href: `${clientLocationOrigin}/${ApplicationConfigurations.IdCard.slug}/${application.id}`,
          },
        },
      ],
    },
  }
}

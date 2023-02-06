import { ChangeCoOwnerOfVehicleAnswers } from '@island.is/application/templates/transport-authority/change-co-owner-of-vehicle'
import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../../types'
import { EmailRecipient } from '../types'
import { pathToAsset } from '../change-co-owner-of-vehicle.utils'
import { ApplicationConfigurations } from '@island.is/application/types'

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
  const answers = application.answers as ChangeCoOwnerOfVehicleAnswers
  const permno = answers?.pickVehicle?.plate

  if (!recipient.email) throw new Error('Recipient email was undefined')
  if (!permno) throw new Error('Permno was undefined')

  const subject =
    'Tilkynning um breytingu á meðeigendum - Búið er að skrá beiðni'

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
              `<span>Breyting á meðeigendum fyrir ökutækið ${permno} hafa verið skráð.</span><br/>` +
              `<span>Allir aðilar samþykktu inn á island.is/umsoknir og búið er að greiða fyrir tilkynninguna.</span>`,
          },
        },
        {
          component: 'Button',
          context: {
            copy: 'Skoða umsókn',
            href: `${clientLocationOrigin}/${ApplicationConfigurations.ChangeCoOwnerOfVehicle.slug}/${application.id}`,
          },
        },
      ],
    },
  }
}

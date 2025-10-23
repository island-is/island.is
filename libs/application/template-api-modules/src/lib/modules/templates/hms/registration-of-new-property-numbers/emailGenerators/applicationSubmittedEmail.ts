import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../../types'
import { EmailRecipient, RealEstateAnswers } from '../shared'
import { pathToAsset } from '../utils'
import { ApplicationConfigurations } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { Fasteign } from '@island.is/clients/assets'
import { formatCurrency } from '@island.is/application/ui-components'

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

  // Applicant name
  const applicantName = getValueViaPath<string>(
    application.answers,
    'applicant.name',
  )

  const realEstate = getValueViaPath<RealEstateAnswers>(
    application.answers,
    'realEstate.data',
  )
  const selectedRealEstate = getValueViaPath<Array<Fasteign>>(
    application.answers,
    'getProperties.data',
  )?.find((property) => property.fasteignanumer === realEstate?.realEstateName)

  const subject = 'Umsókn móttekin!'
  const message =
    `<span>Umsókn um stofnun fasteignanúmers hefur verið móttekin.</span><br/>` +
    `<span>Upplýsingar úr umsókn:</span><br/>` +
    `<span>Umsækjandi: ${applicantName}</span><br/>` +
    `<span>Fasteignin: ${selectedRealEstate?.sjalfgefidStadfang?.birting}</span><br/>` +
    `<span>Fjöldi fasteignanúmera: ${realEstate?.realEstateAmount}</span><br/>` +
    `<span>Upphæð greiðslu: ${formatCurrency(
      realEstate?.realEstateCost || '',
    )}</span><br/>`

  const goodbyeMessage = `<span>Með kveðju,<span><br/>` + `<span>HMS<span><br/>`

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
            src: pathToAsset('Illustration.jpg'),
            alt: 'manneskja fær tilkynningu',
          },
        },
        {
          component: 'Heading',
          context: { copy: subject },
        },
        {
          component: 'Copy',
          context: {
            copy: message,
          },
        },
        {
          component: 'Button',
          context: {
            copy: 'Skoða umsókn',
            href: `${clientLocationOrigin}/${ApplicationConfigurations.SecondarySchool.slug}/${application.id}`,
          },
        },
        {
          component: 'Copy',
          context: {
            copy: goodbyeMessage,
          },
        },
      ],
    },
  }
}

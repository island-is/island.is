import { ApplicationConfigurations } from '@island.is/application/types'
import { AccidentNotificationAnswers } from '@island.is/application/templates/iceland-health/accident-notification'
import { SendMailOptions } from 'nodemailer'
import { EmailTemplateGeneratorProps } from '../../../../../types'
import { pathToAsset } from '../accident-notification.utils'

interface ConfirmationEmail {
  (
    props: EmailTemplateGeneratorProps,
    applicationSenderName: string,
    applicationSenderEmail: string,
    ihiDocumentId?: number,
  ): SendMailOptions
}

export const generateConfirmationEmail: ConfirmationEmail = (
  props,
  applicationSenderName,
  applicationSenderEmail,
  ihiDocumentId,
) => {
  const {
    application,
    options: { clientLocationOrigin },
  } = props
  const answers = application.answers as AccidentNotificationAnswers
  const applicant = {
    name: answers.applicant.name,
    address: answers.applicant.email,
  }

  const subject = `Tilkynning móttekin.`

  return {
    from: {
      name: applicationSenderName,
      address: applicationSenderEmail,
    },
    to: applicant,
    cc: undefined,
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
            alt: 'Maður með barn myndskreyting',
          },
        },
        {
          component: 'Heading',
          context: { copy: subject },
        },
        {
          component: 'Subtitle',
          context: {
            copy: 'Skjalanúmer',
            application: `#${ihiDocumentId}`,
          },
        },
        {
          component: 'Copy',
          context: {
            copy: 'Sjúkratryggingar Íslands verða í sambandi við þig ef frekari upplýsingar vantar. Hægt er að skoða tilkynninguna á island.is eða með því að smella á hlekkinn hér að neðan.',
          },
        },
        {
          component: 'Button',
          context: {
            copy: 'Skoða tilkynningu',
            href: `${clientLocationOrigin}/${ApplicationConfigurations.AccidentNotification.slug}/${application.id}`,
          },
        },
      ],
    },
  }
}

import { ComplaintsToAlthingiOmbudsmanAnswers } from '@island.is/application/templates/complaints-to-althingi-ombudsman'
import { SendMailOptions } from 'nodemailer'
import { EmailTemplateGeneratorProps } from '../../../../types'
import { pathToAsset } from '../complaints-to-althingi-ombudsman.utils'

interface ConfirmationEmail {
  (
    props: EmailTemplateGeneratorProps,
    applicationSenderName: string,
    applicationSenderEmail: string,
  ): SendMailOptions
}

export const generateConfirmationEmail: ConfirmationEmail = (
  props,
  applicationSenderName,
  applicationSenderEmail,
) => {
  const { application } = props
  const answers = application.answers as ComplaintsToAlthingiOmbudsmanAnswers
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
            copy: 'Umboðsmaður Alþingis verður í sambandi við þig ef frekari upplýsingar vantar.',
          },
        },
      ],
    },
  }
}

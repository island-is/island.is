import { dedent } from 'ts-dedent'
import {
  EmailTemplateGenerator,
  EmailTemplateGeneratorProps,
} from '../../../../types'
import { SendMailOptions } from 'nodemailer'
import { Attachment } from 'nodemailer/lib/mailer'
import { ComplaintsToAlthingiOmbudsmanAnswers } from '@island.is/application/templates/complaints-to-althingi-ombudsman'
import { pathToAsset } from '../complaints-to-althingi-ombudsman.utils.ts'

interface ConfirmationEmail {
  (
    props: EmailTemplateGeneratorProps,
    applicationSenderName: string,
    applicationSenderEmail: string,
    attachments: Attachment[],
  ): SendMailOptions
}

export const generateConfirmationEmail: EmailTemplateGenerator = (props) => {
  const {
    application,
    options: { email },
  } = props

  const answers = application.answers as ComplaintsToAlthingiOmbudsmanAnswers
  const applicant = {
    name: answers.information.name ?? '',
    address: answers.information.email ?? '',
  }

  const subject = `Kvörtun þín hefur verið móttekin.`

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: applicant,
    cc: undefined,
    subject,
    template: {
      title: subject,
      body: [
        {
          component: 'Image',
          context: { src: pathToAsset('logo.jpg'), alt: 'island.is merki' },
        },
        {
          component: 'Image',
          context: {
            src: pathToAsset('illustration.jpg'),
            alt: 'Myndskreyting',
          },
        },
        { component: 'Heading', context: { copy: 'Staðfesting á umsókn' } },
        {
          component: 'Copy',
          context: {
            copy:
              'Við munum nú fara yfir verkefnið og við sendum á svör innan tíðar á þá tengiliði sem settir voru inn í umsóknina.',
          },
        },
      ],
    },
  }
}

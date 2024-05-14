import { EmailTemplateGeneratorProps } from '../../../../types'
import { SendMailOptions } from 'nodemailer'
import { AnnouncementOfDeathAnswers } from '@island.is/application/templates/announcement-of-death'
import { pathToAsset } from '../announcement-of-death-utils'

interface FirearmsApplicantEmail {
  (props: EmailTemplateGeneratorProps): SendMailOptions
}

export const generateFirearmApplicantEmail: FirearmsApplicantEmail = (
  props,
) => {
  const {
    application,
    options: { email = { sender: 'Ísland.is', address: 'no-reply@island.is' } },
  } = props

  const firearmApplicant = application.answers
    .firearmApplicant as AnnouncementOfDeathAnswers['firearmApplicant']

  if (!firearmApplicant) throw new Error('Firearm applicant was undefined')

  const subject = 'Tilkynning um vörslu skotvopna'

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: firearmApplicant.name,
        address: firearmApplicant.email,
      },
    ],
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
          component: 'Heading',
          context: { copy: subject },
        },
        {
          component: 'Copy',
          context: {
            copy:
              `<span>Góðan dag,</span><br/><br/>` +
              `<span>þú hefur verið tilnefndur til að taka við vörslu skotvopna sem tilheyra dánarbúi ${application.answers.caseNumber} - ${firearmApplicant.name}</span><br/>` +
              `<span>Með undirritun lýsir þú því yfir að þú hafir leyfi til að varsla skotvopnin og samþykkir jafnframt að taka við vörslu þeirra.</span><br/>`,
          },
        },
      ],
    },
  }
}

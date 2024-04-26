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
    options: { email },
  } = props

  const answers = application.answers as AnnouncementOfDeathAnswers

  if (!answers.firearmApplicant)
    throw new Error('Firearm applicant was undefined')

  const subject = 'Tilkynning um vörslu skotvopna'

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: answers.firearmApplicant.name,
        address: answers.firearmApplicant.email,
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
              `<span>þú hefur verið tilnefndur til að taka við vörslu eftirtalinna skotvopna sem tilheyra dánarbúi X: ${'TEST'} og ${'TEST'}</span><br/>` +
              `<span>Með undirritun lýsir þú því yfir að þú hafir leyfi til að varsla skotvopnin og samþykkir jafnframt að taka við vörslu þeirra.</span><br/>`,
          },
        },
      ],
    },
  }
}

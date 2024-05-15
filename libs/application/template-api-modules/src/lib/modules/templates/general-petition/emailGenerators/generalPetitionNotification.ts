import { getValueViaPath } from '@island.is/application/core'
import { EmailTemplateGeneratorProps } from '../../../../types'
import { SendMailOptions } from 'nodemailer'

interface GeneralPetitionNotificationEmail {
  (props: EmailTemplateGeneratorProps): SendMailOptions
}

export const generalPetitionNotificationEmail: GeneralPetitionNotificationEmail =
  (props) => {
    const {
      application,
      options: {
        email = { sender: 'Ísland.is', address: 'no-reply@island.is' },
      },
    } = props

    const subject = 'Tilkynning um vörslu skotvopna'
    const contactFullName = getValueViaPath<string>(
      application.answers,
      'fullName',
    )
    const contactEmail = getValueViaPath<string>(application.answers, 'email')

    if (!contactFullName || !contactEmail) {
      throw new Error(
        'Full name or email is missing in the application answers',
      )
    }

    return {
      from: {
        name: email.sender,
        address: email.address,
      },
      to: [
        {
          name: contactFullName,
          address: contactEmail,
        },
      ],
      subject,
      template: {
        title: subject,
        body: [
          {
            component: 'Heading',
            context: { copy: subject },
          },
          {
            component: 'Copy',
            context: {
              copy:
                `<span>Góðan dag,</span><br/><br/>` +
                `<span>þú hefur verið tilnefndur til að taka við vörslu skotvopna sem tilheyra dánarbúi /span><br/>` +
                `<span>Með undirritun lýsir þú því yfir að þú hafir leyfi til að varsla skotvopnin og samþykkir jafnframt að taka við vörslu þeirra.</span><br/>`,
            },
          },
        ],
      },
    }
  }

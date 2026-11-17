import get from 'lodash/get'

import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../types'
import { pathToAsset } from '../parental-leave.utils'

export type ApplicationApprovedByEmployerEmail = (
  props: EmailTemplateGeneratorProps,
  senderName?: string,
  senderEmail?: string,
) => Message

// TODO handle translations
export const generateApplicationApprovedByEmployerEmail: ApplicationApprovedByEmployerEmail =
  (props): Message => {
    const {
      application,
      options: { email },
    } = props

    const applicantEmail =
      get(application.answers, 'applicant.email') ||
      get(application.externalData, 'userProfile.data.email')

    const subject = 'Umsókn um fæðingarorlof samþykkt af atvinnuveitanda'

    return {
      from: {
        name: email.sender,
        address: email.address,
      },
      to: [
        {
          name: '',
          address: applicantEmail as string,
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
              alt: 'Vinnumálastofnun merki',
            },
          },
          {
            component: 'Image',
            context: {
              src: pathToAsset('child.jpg'),
              alt: 'Barn myndskreyting',
            },
          },
          { component: 'Heading', context: { copy: subject } },
          { component: 'Copy', context: { copy: 'Góðan dag.' } },
          {
            component: 'Copy',
            context: {
              copy: 'Atvinnuveitandi hefur samþykkt umsókn þína og hefur hún nú verið send áfram til úrvinnslu.',
            },
          },
          { component: 'Copy', context: { copy: 'Með kveðju,' } },
          { component: 'Copy', context: { copy: 'Fæðingarorlofssjóður' } },
        ],
      },
    }
  }

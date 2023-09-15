import get from 'lodash/get'

import { Message } from '@island.is/email-service'

import { ApplicationConfigurations } from '@island.is/application/types'

import { EmailTemplateGeneratorProps } from '../../../../types'
import { pathToAsset } from '../parental-leave.utils'

export type EmployerRejectedEmail = (
  props: EmailTemplateGeneratorProps,
  senderName?: string,
  senderEmail?: string,
) => Message

// TODO handle translations
export const generateEmployerRejected: EmployerRejectedEmail = (props) => {
  const {
    application,
    options: { email, clientLocationOrigin },
  } = props

  const to =
    get(application.answers, 'applicant.email') ||
    get(application.externalData, 'userProfile.data.email')
  const subject = 'Beiðni þín um samþykki fæðingarorlofs hafnað'

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: '',
        address: to as string,
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
            src: pathToAsset('reject.jpeg'),
            alt: 'Barn myndskreyting',
          },
        },
        { component: 'Heading', context: { copy: subject } },
        { component: 'Copy', context: { copy: 'Góðan dag / Good day,' } },
        {
          component: 'Copy',
          context: {
            copy: 'Vinnuveitandi hefur hafnað beiðni þinni um samþykki fæðingarorlofs. Þú þarft því að breyta umsókn þinni.',
          },
        },
        {
          component: 'Copy',
          context: {
            copy: 'Your employer has denied your request. You therefore need to modify your application.',
          },
        },
        {
          component: 'Button',
          context: {
            copy: 'Opna umsókn',
            href: `${clientLocationOrigin}/${ApplicationConfigurations.ParentalLeave.slug}/${application.id}`,
          },
        },
      ],
    },
  }
}

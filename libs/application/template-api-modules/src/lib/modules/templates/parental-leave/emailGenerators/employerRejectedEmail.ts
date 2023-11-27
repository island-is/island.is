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
  const subject = 'Beiðni þín um staðfestingu tímabils var ekki samþykkt'

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
            copy: 'Vinnuveitandi þinn samþykkti ekki valið tímabil en óskar eftir nýju og breyttu tímabili. Þú getur gert breytingar á umsókn þinni og sent aftur til skoðunar.',
          },
        },
        {
          component: 'Copy',
          context: {
            copy: 'Your employer did not approve the selected period and requests that you resubmit an alternative period. You can make edits to your application and re-submit for consideration.',
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

import get from 'lodash/get'

import { Message } from '@island.is/email-service'

import { AssignmentEmailTemplateGenerator } from '../../../../types'
import { pathToAsset } from '../parental-leave.utils'

// TODO handle translations
export const generateRetryAssignEmployerApplicationEmail: AssignmentEmailTemplateGenerator = (
  props,
  assignLink,
): Message => {
  const {
    application,
    options: { email },
  } = props

  const employerEmail = get(application.answers, 'employer.email')
  const subject = 'Hér er nýr linkur til að nálgast umsókn um fæðingarorlof'

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: '',
        address: employerEmail as string,
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
            src: pathToAsset('notification.jpg'),
            alt: 'Barn myndskreyting',
          },
        },
        { component: 'Heading', context: { copy: subject } },
        { component: 'Copy', context: { copy: 'Góðan dag.' } },
        {
          component: 'Copy',
          context: {
            copy: `Ef þú áttir von á þessum tölvupósti þá getur þú smellt á takkann hér fyrir neðan.`,
          },
        },
        {
          component: 'Button',
          context: {
            copy: 'Yfirfara umsókn',
            href: assignLink,
          },
        },
        { component: 'Copy', context: { copy: 'Með kveðju,' } },
        { component: 'Copy', context: { copy: 'Fæðingarorlofssjóður' } },
      ],
    },
  }
}

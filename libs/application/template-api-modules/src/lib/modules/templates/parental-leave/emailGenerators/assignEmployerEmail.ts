import get from 'lodash/get'

import { Message } from '@island.is/email-service'

import { AssignmentEmailTemplateGenerator } from '../../../../types'
import { pathToAsset } from '../parental-leave.utils'

// TODO handle translations
export const generateAssignEmployerApplicationEmail: AssignmentEmailTemplateGenerator = (
  props,
  assignLink,
): Message => {
  const {
    application,
    options: { email },
  } = props

  const employerEmail = get(application.answers, 'employer.email')
  const applicantName = get(application.externalData, 'person.data.fullName')
  const subject = 'Yfirferð á umsókn um fæðingarorlof'

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
            copy: `Umsækjandi ${applicantName} með kennitölu ${application.applicant} hefur skráð þig sem atvinnuveitanda í umsókn sinni.`,
          },
        },
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
        {
          component: 'Copy',
          context: {
            copy: `Athugið! Ef hnappur virkar ekki, getur þú afritað hlekkinn hér að neðan og límt hann inn í vafrann þinn.`,
            small: true,
          },
        },
        {
          component: 'Copy',
          context: {
            copy: `Athugið: Ef upp kemur 404 villa hefur umsækjandi breytt umsókninni og sent nýja, þér ætti að hafa borist nýr póstur.`,
            small: true,
          },
        },
        {
          component: 'Copy',
          context: {
            copy: assignLink,
            small: true,
          },
        },
        {
          component: 'Copy',
          context: {
            copy: `<br />`,
            small: true,
          },
        },
        { component: 'Copy', context: { copy: 'Með kveðju,' } },
        { component: 'Copy', context: { copy: 'Fæðingarorlofssjóður' } },
      ],
    },
  }
}

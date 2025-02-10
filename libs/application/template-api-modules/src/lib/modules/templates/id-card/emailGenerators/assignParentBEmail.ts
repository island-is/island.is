import get from 'lodash/get'

import { ApplicationConfigurations } from '@island.is/application/types'
import { Message } from '@island.is/email-service'

import { EmailTemplateGenerator } from '../../../../types'
import { pathToAsset } from '../utils'

export let linkOtherParentSMS = ''

export const generateAssignParentBApplicationEmail: EmailTemplateGenerator = (
  props,
): Message => {
  const {
    application,
    options: { email, clientLocationOrigin },
  } = props

  const otherParentEmail = get(
    application.answers,
    'secondGuardianInformation.email',
  )
  const childName = get(
    application.answers,
    'applicantInformation.applicantName',
  )
  const applicantName = get(
    application.answers,
    'firstGuardianInformation.name',
  )

  if (!otherParentEmail) {
    throw new Error('Could not find other parent email')
  }

  const subject = 'Yfirferð á umsókn um nafnskírteini'
  const link = `${clientLocationOrigin}/${ApplicationConfigurations.IdCard.slug}/${application.id}`

  linkOtherParentSMS = link

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: '',
        address: otherParentEmail as string,
      },
    ],
    subject,
    template: {
      title: subject,
      body: [
        { component: 'Heading', context: { copy: subject } },
        {
          component: 'Image',
          context: {
            src: pathToAsset('notification.jpg'),
            alt: 'myndskreyting',
          },
        },
        { component: 'Copy', context: { copy: 'Góðan dag.' } },
        {
          component: 'Copy',
          context: {
            copy: `${applicantName} Kt: ${application.applicant} hefur skráð þig sem forráðamann í umsókn um nafnskírteini handa ${childName} og er að óska eftir samþykki frá þér.`,
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
            copy: 'Skoða umsókn',
            href: link,
          },
        },
        {
          component: 'Copy',
          context: {
            copy: `Þú hefur viku til að bregðast við umsókninni.`,
            small: true,
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
            copy: link,
            small: true,
          },
        },
      ],
    },
  }
}

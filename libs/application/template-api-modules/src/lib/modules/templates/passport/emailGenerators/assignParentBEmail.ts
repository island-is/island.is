import get from 'lodash/get'

import { ApplicationConfigurations } from '@island.is/application/types'
import { Message } from '@island.is/email-service'

import { EmailTemplateGenerator } from '../../../../types'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { join } from 'path'

export let linkOtherParentSMS = ''

export const pathToAsset = (file: string) => {
  if (isRunningOnEnvironment('local')) {
    return join(
      __dirname,
      `../../../../libs/application/template-api-modules/src/lib/modules/templates/passport/emailGenerators/assets/${file}`,
    )
  }

  return join(__dirname, `./passport-assets/${file}`)
}

export const generateAssignParentBApplicationEmail: EmailTemplateGenerator = (
  props,
): Message => {
  const {
    application,
    options: { email, clientLocationOrigin },
  } = props

  const otherParentEmail = get(
    application.answers,
    'childsPersonalInfo.guardian2.email',
  )
  const childName = get(application.answers, 'childsPersonalInfo.name')
  const applicantName = get(
    application.answers,
    'childsPersonalInfo.guardian1.name',
  )

  if (!otherParentEmail) {
    throw new Error('Could not find other parent email')
  }

  const subject = 'Yfirferð á umsókn um vegabréf'
  const link = `${clientLocationOrigin}/${ApplicationConfigurations.Passport.slug}/${application.id}`

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
        { component: 'Copy', context: { copy: 'Góðan dag.' } },
        {
          component: 'Copy',
          context: {
            copy: `${applicantName} Kt: ${application.applicant} hefur skráð þig sem forráðamann í umsókn um vegabréf handa ${childName} og er að óska eftir samþykki frá þér.`,
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

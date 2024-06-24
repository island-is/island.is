import { ApplicationConfigurations } from '@island.is/application/types'
import { Message } from '@island.is/email-service'

import { EmailTemplateGeneratorProps } from '../../../../types'
import { EmailRecipient } from '../types'
import { pathToAsset } from '../utils'

export let linkOtherParentSMS = ''

export type ApplicationRejectedEmail = (
  props: EmailTemplateGeneratorProps,
  recipient: EmailRecipient,
) => Message

export const generateApplicationRejectEmail: ApplicationRejectedEmail = (
  props,
  recipient,
): Message => {
  const {
    application,
    options: { email, clientLocationOrigin },
  } = props

  if (!recipient.email) {
    throw new Error('Could not find other parent email')
  }

  const subject = 'Umsókn um nafnskírteini afturkölluð'
  const link = `${clientLocationOrigin}/${ApplicationConfigurations.IdCard.slug}/${application.id}`

  linkOtherParentSMS = link

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: recipient.name,
        address: recipient.email,
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
            copy: `Umsókn um nafnskírteini hefur verið afturkölluð.`,
          },
        },
        {
          component: 'Copy',
          context: {
            copy: `Til þess að sækja um nafnskírteini rafrænt verður þú að byrja 
            ferlið upp á nýtt á umsóknarvef island.is: island.is/umsoknir, ásamt 
            því að hinn forráðamaðurinn þarf að staðfesta rafrænt innan gefins 
            tímafrests. Þessi tilkynning á aðeins við um rafræna umsókn af 
            umsóknarvef island.is en ekki um umsókn um nafnskírteini sem skilað hefur 
            verið inn til Sýslumanns á pappír. Vinsamlegast hafið samband við Þjónustuver 
            Sýslumanns (afgreidsla@samgongustofa.is) ef nánari upplýsinga er þörf.`,
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

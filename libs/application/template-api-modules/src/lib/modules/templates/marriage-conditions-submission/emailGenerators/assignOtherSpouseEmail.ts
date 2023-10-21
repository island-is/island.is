import get from 'lodash/get'

import { ApplicationConfigurations } from '@island.is/application/types'
import { Message } from '@island.is/email-service'

import { EmailTemplateGeneratorProps } from '../../../../types'
import { pathToAsset } from './utils'

export type AssignOtherSpuseEmail = (
  props: EmailTemplateGeneratorProps,
  senderName?: string,
  senderEmail?: string,
) => Message

// TODO handle translations
export const generateAssignOtherSpouseApplicationEmail: AssignOtherSpuseEmail =
  (props): Message => {
    const {
      application,
      options: { email, clientLocationOrigin },
    } = props

    const otherSpouseEmail = get(application.answers, 'spouse.email')

    if (!otherSpouseEmail) {
      throw new Error('Could not find other Spouse email')
    }

    const subject = 'Umsókn um könnunarvottorð'
    const link = `${clientLocationOrigin}/${ApplicationConfigurations.MarriageConditions.slug}/${application.id}`

    return {
      from: {
        name: email.sender,
        address: email.address,
      },
      to: [
        {
          name: '',
          address: otherSpouseEmail as string,
        },
      ],
      replyTo: {
        name: 'island.is',
        address: 'umsoknir@island.is',
      },
      subject,
      template: {
        title: subject,
        body: [
          {
            component: 'Image',
            context: {
              src: pathToAsset('logo.jpg'),
              alt: 'Stafrænt Ísland merki',
            },
          },
          {
            component: 'Image',
            context: {
              src: pathToAsset('digital-services.jpg'),
              alt: 'Tilkynning myndskreyting',
            },
          },
          { component: 'Heading', context: { copy: subject } },
          { component: 'Copy', context: { copy: 'Góðan dag.' } },
          {
            component: 'Copy',
            context: {
              copy: `Þín bíður beiðni um könnun á hjónavígsluskilyrðum.`,
            },
          },
          {
            component: 'Copy',
            context: {
              copy: `Þú hefur 60 daga til að bregðast við umsókninni.`,
              small: true,
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

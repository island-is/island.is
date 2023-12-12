import get from 'lodash/get'

import { Message } from '@island.is/email-service'

import { AssignmentEmailTemplateGenerator } from '../../../../types'

// TODO handle translations
export const generateAssignApplicationEmail: AssignmentEmailTemplateGenerator =
  (props, assignLink): Message => {
    const {
      application,
      options: { email },
    } = props

    const employerEmail = get(application.answers, 'assigneeEmail')

    const subject = 'Yfirferð á umsókn.'

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
          { component: 'Heading', context: { copy: subject } },
          { component: 'Copy', context: { copy: 'Góðan dag.' } },

          {
            component: 'Copy',
            context: {
              copy: `Ef þú áttir von á þessum tölvupósti smellir þú á takkan hér fyrir neðan. Ef annar einstaklingur á að samþykkja fæðingarorlofið má áframsenda póstinn á viðkomandi einstakling (passið þó að opna ekki linkinn).`,
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
              copy: `Ef hnappur virkar ekki, getur þú afritað hlekkinn hér að neðan og límt hann inn í vafrann þinn.`,
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
              copy: `Athugið: Ef upp kemur 404 villa hefur umsækjandi breytt umsókninni og sent nýja, þér ætti að hafa borist nýr póstur.`,
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
          { component: 'Copy', context: { copy: 'Island.is' } },
        ],
      },
    }
  }

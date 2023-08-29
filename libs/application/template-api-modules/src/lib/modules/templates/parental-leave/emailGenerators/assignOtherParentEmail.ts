import { ApplicationConfigurations } from '@island.is/application/types'
import { Message } from '@island.is/email-service'

import { EmailTemplateGeneratorProps } from '../../../../types'
import { pathToAsset } from '../parental-leave.utils'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '@island.is/application/templates/parental-leave'

export let linkOtherParentSMS = ''

export type AssignOtherParentEmail = (
  props: EmailTemplateGeneratorProps,
  senderName?: string,
  senderEmail?: string,
) => Message

// TODO handle translations
export const generateAssignOtherParentApplicationEmail: AssignOtherParentEmail =
  (props): Message => {
    const {
      application,
      options: { email, clientLocationOrigin },
    } = props

    const { otherParentEmail } = getApplicationAnswers(application.answers)
    const { applicantName } = getApplicationExternalData(
      application.externalData,
    )

    if (!otherParentEmail) {
      throw new Error('Could not find other parent email')
    }

    const subject = 'Yfirferð á umsókn um fæðingarorlof'
    const link = `${clientLocationOrigin}/${ApplicationConfigurations.ParentalLeave.slug}/${application.id}`

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
              copy: `${applicantName} Kt:${application.applicant} hefur skráð þig sem foreldri í umsókn sinni og er að óska eftir réttindum frá þér.`,
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

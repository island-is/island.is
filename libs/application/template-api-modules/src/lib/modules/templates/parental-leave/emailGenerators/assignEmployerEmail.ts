import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../types'
import { pathToAsset } from '../parental-leave.utils'
import {
  getApplicationExternalData,
  getUnApprovedEmployers,
} from '@island.is/application/templates/parental-leave'
import { getValueViaPath } from '@island.is/application/core'

export let assignLinkEmployerSMS = ''

export type AssignEmployerEmail = (
  props: EmailTemplateGeneratorProps,
  assignLink: string,
  senderName?: string,
  senderEmail?: string,
) => Message

// TODO handle translations
export const generateAssignEmployerApplicationEmail: AssignEmployerEmail = (
  props,
  assignLink,
): Message => {
  const {
    application,
    options: { email },
  } = props

  assignLinkEmployerSMS = assignLink

  const employers = getUnApprovedEmployers(application.answers)
  const employerEmailOld = getValueViaPath(
    application.answers,
    'employer.email',
  ) as string

  const employerEmail =
    employers.length > 0 ? employers[0].email : employerEmailOld ?? ''
  const { applicantName } = getApplicationExternalData(application.externalData)
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
            copy: `${applicantName} Kt:${application.applicant} hefur skráð þig sem atvinnuveitanda í umsókn sinni.`,
          },
        },
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
            copy: `Athugið: Ef upp kemur villa við að tengjast umsókn þá hefur umsækjandinn að öllum líkindum tekið umsóknina aftur til breytinga. Þér mun berast nýr póstur þegar umsækjandi hefur lokið við breytingarnar og sent umsóknina aftur til samþykkis.`,
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

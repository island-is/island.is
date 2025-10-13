import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '@island.is/application/templates/new-primary-school'
import { ApplicationConfigurations } from '@island.is/application/types'
import { Message } from '@island.is/email-service'
import { format as formatKennitala } from 'kennitala'
import { EmailTemplateGenerator } from '../../../../types'
import { pathToAsset } from '../new-primary-school.utils'

export const generateAssignPayerEmail: EmailTemplateGenerator = (
  props,
): Message => {
  const {
    application,
    options: { email, clientLocationOrigin },
  } = props

  const { payerName, payerEmail, childInfo } = getApplicationAnswers(
    application.answers,
  )
  const { applicantName } = getApplicationExternalData(application.externalData)

  if (!payerEmail) throw new Error('Could not find payer email')

  const subject = 'Yfirferð á umsókn í grunnskóla'

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: payerName || '',
        address: payerEmail,
      },
    ],
    subject,
    template: {
      title: subject,
      body: [
        {
          component: 'Image',
          context: {
            src: pathToAsset('islandis-logo.png'),
            alt: 'Ísland.is logo',
          },
        },
        {
          component: 'Spacer',
        },
        { component: 'Heading', context: { copy: subject } },
        { component: 'Copy', context: { copy: 'Góðan dag,' } },
        {
          component: 'Copy',
          context: {
            copy: `${applicantName} Kt: ${formatKennitala(
              application.applicant,
            )} hefur skráð þig sem greiðanda fyrir skólavist í umsókn hjá eftirfaradi barni og er að óska eftir samþykki frá þér.`,
          },
        },
        {
          component: 'Copy',
          context: {
            copy: `${childInfo?.name} Kt: ${formatKennitala(
              childInfo?.nationalId ?? '',
            )}`,
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
            href: `${clientLocationOrigin}/${ApplicationConfigurations.NewPrimarySchool.slug}/${application.id}`,
          },
        },
      ],
    },
  }
}

import { getApplicationExternalData } from '@island.is/application/templates/new-primary-school'
import { ApplicationConfigurations } from '@island.is/application/types'
import { Message } from '@island.is/email-service'
import { EmailTemplateGenerator } from '../../../../types'
import { pathToAsset } from '../new-primary-school.utils'

export const generatePayerRejectedApplicationEmail: EmailTemplateGenerator = (
  props,
): Message => {
  const {
    application,
    options: { email, clientLocationOrigin },
  } = props

  const { applicantName, userProfileEmail } = getApplicationExternalData(
    application.externalData,
  )

  if (!userProfileEmail) throw new Error('Could not find applicant email')

  const subject = 'Skráður greiðandi hafnaði greiðsluþátttöku'

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: applicantName || '',
        address: userProfileEmail,
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
            copy: 'Skráður greiðandi hefur hafnað greiðsluþáttöku í umsókn í grunnskóla. Þú þarft því að breyta umsókn þinni.',
          },
        },
        {
          component: 'Button',
          context: {
            copy: 'Opna umsókn',
            href: `${clientLocationOrigin}/${ApplicationConfigurations.NewPrimarySchool.slug}/${application.id}`,
          },
        },
      ],
    },
  }
}

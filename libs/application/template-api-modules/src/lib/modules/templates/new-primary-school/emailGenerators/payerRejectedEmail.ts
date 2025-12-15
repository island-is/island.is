import {
  getApplicationAnswers,
  getApplicationExternalData,
  getSchoolName,
} from '@island.is/application/templates/new-primary-school'
import { ApplicationConfigurations } from '@island.is/application/types'
import { Message } from '@island.is/email-service'
import { format as formatKennitala } from 'kennitala'
import { EmailTemplateGenerator } from '../../../../types'
import { pathToAsset } from '../new-primary-school.utils'

export const generatePayerRejectedApplicationEmail: EmailTemplateGenerator = (
  props,
): Message => {
  const {
    application,
    options: { email, clientLocationOrigin },
  } = props

  const { childInfo, selectedSchoolId } = getApplicationAnswers(
    application.answers,
  )

  const { applicantName, userProfileEmail } = getApplicationExternalData(
    application.externalData,
  )

  const selectedSchoolName = getSchoolName(
    application.externalData,
    selectedSchoolId ?? '',
  )

  if (!userProfileEmail) throw new Error('Could not find applicant email')
  if (!childInfo) throw new Error('Could not find child information')
  if (!selectedSchoolName)
    throw new Error('Could not find selected school name')

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
            copy: 'Skráður greiðandi hefur hafnað greiðsluþátttöku í umsókn þinni um sjálfstætt starfandi skóla fyrir eftirfarandi barn:',
          },
        },
        {
          component: 'Copy',
          context: {
            copy: `${childInfo.name} Kt. ${formatKennitala(
              childInfo.nationalId,
            )}`,
          },
        },
        {
          component: 'Copy',
          context: {
            copy: selectedSchoolName,
          },
        },
        {
          component: 'Copy',
          context: {
            copy: `Þú þarft því að opna umsóknina og skrá nýjan greiðanda áður en umsókn er send til úrvinnslu.`,
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

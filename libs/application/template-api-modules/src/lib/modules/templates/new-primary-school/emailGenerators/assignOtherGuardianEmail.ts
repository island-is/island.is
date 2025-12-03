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

export const generateAssignOtherGuardianEmail: EmailTemplateGenerator = (
  props,
): Message => {
  const {
    application,
    options: { email, clientLocationOrigin },
  } = props

  const { childInfo, guardians, selectedSchoolId } = getApplicationAnswers(
    application.answers,
  )
  const { applicantName } = getApplicationExternalData(application.externalData)

  const selectedSchoolName = getSchoolName(
    application.externalData,
    selectedSchoolId ?? '',
  )

  if (!guardians[1]) throw new Error('Could not find other guardian')
  if (!childInfo) throw new Error('Could not find child information')
  if (!selectedSchoolName)
    throw new Error('Could not find selected school name')

  const subject = 'Yfirferð á umsókn í grunnskóla'

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: guardians[1].fullName || '',
        address: guardians[1].email,
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
            copy: `${applicantName} Kt. ${formatKennitala(
              application.applicant,
            )} hefur stofnað umsókn í grunnskóla fyrir eftirfarandi barn og óskar eftir samþykki frá þér:`,
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
            copy: `Ef þú áttir von á þessum tölvupósti þá getur þú smellt á hnappinn hér fyrir neðan til að samþykkja umsókn.`,
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

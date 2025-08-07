import { buildSection } from '@island.is/application/core'
import { userInformation } from '../../../lib/messages'
import { applicantSubSection } from './applicantSubSection'
import { transporterSubSection } from './transporterSubSection'

export const userInformationSection = buildSection({
  id: 'userInformationSection',
  title: userInformation.general.sectionTitle,
  children: [applicantSubSection, transporterSubSection],
})

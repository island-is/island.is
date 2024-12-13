import { buildSection } from '@island.is/application/core'
import { userInformation } from '../../../lib/messages'
import { personalSubSection } from './PersonalSubSection'
import { custodianSubSection } from './CustodianSubSection'

export const userInformationSection = buildSection({
  id: 'userInformationSection',
  title: userInformation.general.sectionTitle,
  children: [personalSubSection, custodianSubSection],
})

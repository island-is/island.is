import { buildSection } from '@island.is/application/core'
import { userInformation } from '../../../lib/messages'
import { personalSubSection } from './personalSubSection'
import { custodianSubSection } from './custodianSubSection'

export const userInformationSection = buildSection({
  id: 'userInformationSection',
  title: userInformation.general.sectionTitle,
  children: [personalSubSection, custodianSubSection],
})

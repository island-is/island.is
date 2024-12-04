import { buildSection } from '@island.is/application/core'
import { userInformation } from '../../../lib/messages'
import { personalSubSection } from './PersonalSubSection'
import { custodianSubSection } from './CustodianSubSection'
import { supportingDocumentsSubSection } from './SupportingDocumentsSubSection'

export const userInformationSection = buildSection({
  id: 'userInformationSection',
  title: userInformation.general.sectionTitle,
  children: [
    personalSubSection,
    custodianSubSection,
    supportingDocumentsSubSection,
  ],
})

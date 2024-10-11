import { buildSection } from '@island.is/application/core'
import { whoIsTheNotificationFor } from '../../../lib/messages'
import { whoIsTheNotificationForMultiField } from './whoIsTheNotificationForMultiField'
import { injuredPersonInformationSubSection } from './injuredPersonInformationSubSection'
import { juridicalPersonCompanySubSection } from './juridicialPersonCompanySubSection'
import { powerOfAttorneySubSection } from './powerOfAttorneySubSection'
import { childInCustodySubSection } from './childInCustodySubSection'
import { powerOfAttorneyUploadSubSection } from './powerOfAttorneyUploadSubSection'

export const whoIsTheNotificationForSection = buildSection({
  id: 'whoIsTheNotificationFor.section',
  title: whoIsTheNotificationFor.general.sectionTitle,
  children: [
    whoIsTheNotificationForMultiField,
    injuredPersonInformationSubSection,
    juridicalPersonCompanySubSection,
    powerOfAttorneySubSection,
    childInCustodySubSection,
    powerOfAttorneyUploadSubSection,
  ],
})

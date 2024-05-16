import { buildSection } from '@island.is/application/core'
import { whoIsTheNotificationFor } from '../../../lib/messages'
import { whoIsTheNotificationForScreen } from './whoIsTheNotificationFor'
import { injuredPersonInformationScreen } from './injuredPersonInformationScreen'
import { juridicalPersonCompanyScreen } from './juridicialPersonCompanyScreen'
import { powerOfAttorneyScreen } from './powerOfAttorneyScreen'
import { childInCustodyScreen } from './childInCustodyScreen'
import { powerOfAttorneyUploadScreen } from './powerOfAttorneyUploadScreen'

export const whoIsTheNotificationForSection = buildSection({
  id: 'whoIsTheNotificationFor.section',
  title: whoIsTheNotificationFor.general.sectionTitle,
  children: [
    whoIsTheNotificationForScreen,
    injuredPersonInformationScreen,
    juridicalPersonCompanyScreen,
    powerOfAttorneyScreen,
    childInCustodyScreen,
    powerOfAttorneyUploadScreen,
  ],
})

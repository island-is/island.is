import { buildSection } from '@island.is/application/core'
import { reasonForNotificationMessages } from '../../../lib/messages'
import { reasonDescriptionSubSection } from './reasonDescriptionSubSection'
import { reasonForNotificationSubSection } from './reasonForNotificationSubSection'
import { reasonNotificationHistorySubSection } from './reasonNotificationHistorySubSection'

export const reasonForNotificationSection = buildSection({
  id: 'reasonForNotificationSection',
  title: reasonForNotificationMessages.shared.sectionTitle,
  children: [
    reasonDescriptionSubSection,
    reasonForNotificationSubSection,
    reasonNotificationHistorySubSection,
  ],
})

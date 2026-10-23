import { buildOverviewField } from '@island.is/application/core'
import {
  childMessages,
  childSafetyMessages,
  prerequisitesMessages,
  reasonForNotificationMessages,
} from '../lib/messages'
import { getParentMessages } from './childProtectionNotificationUtils'
import { isNoNationalId, showParentsSection } from './conditionUtils'
import { SHOW_REASON_FOR_NOTIFICATION_SUBSECTION } from './constants'
import {
  getChildManualItems,
  getChildSafetyItems,
  getChildWithNationalIdItems,
  getNotifierInfoItems,
  getParent1Items,
  getParent2Items,
  getReasonDescriptionItems,
  getReasonForNotificationItems,
} from './getOverviewItems'

export const adultPersonalOverviewFields = (editable?: boolean) => [
  buildOverviewField({
    id: 'overview.notifierInfo',
    title: prerequisitesMessages.notifierInfo.subSectionTitle,
    items: getNotifierInfoItems,
  }),
  buildOverviewField({
    id: 'overview.childWithNationalId',
    title: childMessages.shared.sectionTitle,
    items: getChildWithNationalIdItems,
  }),
  buildOverviewField({
    id: 'overview.childManual',
    title: childMessages.manualInfo.sectionTitle,
    backId: editable ? 'childInfoManual' : undefined,
    items: getChildManualItems,
    condition: isNoNationalId,
  }),
  buildOverviewField({
    id: 'overview.parent1',
    title: ({ answers }) => getParentMessages(answers).parent1Title,
    backId: editable ? 'parents' : undefined,
    items: getParent1Items,
    hideIfEmpty: true,
    condition: showParentsSection,
  }),
  buildOverviewField({
    id: 'overview.parent2',
    title: ({ answers }) => getParentMessages(answers).parent2Title,
    backId: editable ? 'parents' : undefined,
    items: getParent2Items,
    hideIfEmpty: true,
    condition: showParentsSection,
  }),
  buildOverviewField({
    id: 'overview.reasonDescription',
    title: reasonForNotificationMessages.description.title,
    backId: editable ? 'reasonDescription' : undefined,
    items: getReasonDescriptionItems,
  }),
  buildOverviewField({
    id: 'overview.reasonForNotification',
    title: reasonForNotificationMessages.shared.sectionTitle,
    backId: editable ? 'reasonForNotification' : undefined,
    items: getReasonForNotificationItems,
    hideIfEmpty: true,
    // Client requested this be temporarily hidden; keeping the implementation
    // intact in case they want it back.
    condition: () => SHOW_REASON_FOR_NOTIFICATION_SUBSECTION,
  }),
  buildOverviewField({
    id: 'overview.childSafety',
    title: childSafetyMessages.sectionTitle,
    backId: editable ? 'childSafety' : undefined,
    items: getChildSafetyItems,
    hideIfEmpty: true,
  }),
]

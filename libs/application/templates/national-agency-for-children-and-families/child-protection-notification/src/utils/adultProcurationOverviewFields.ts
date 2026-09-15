import { buildOverviewField } from '@island.is/application/core'
import {
  childMessages,
  childSafetyMessages,
  memmMessages,
  prerequisitesMessages,
  protectiveFactorsMessages,
  reasonForNotificationMessages,
} from '../lib/messages'
import { getParentMessages } from './childProtectionNotificationUtils'
import {
  isKnowsNationalId,
  isNoNationalId,
  isUnborn,
  showParentsSection,
} from './conditionUtils'
import { SHOW_REASON_FOR_NOTIFICATION_SUBSECTION } from './constants'
import {
  getChildManualItems,
  getChildSafetyItems,
  getChildWithNationalIdItems,
  getMemmCultureItems,
  getMemmEducationItems,
  getMemmReceptionItems,
  getMemmWellbeingItems,
  getParent1Items,
  getParent2Items,
  getProtectiveFactorsItems,
  getReasonDescriptionItems,
  getReasonForNotificationItems,
  getReasonNotificationHistoryItems,
  getServiceProviderContactPersonItems,
  getServiceProviderItems,
} from './getOverviewItems'

export const adultProcurationOverviewFields = (editable?: boolean) => [
  buildOverviewField({
    id: 'overview.serviceProvider',
    title: prerequisitesMessages.serviceProvider.subSectionTitle,
    items: getServiceProviderItems,
  }),
  buildOverviewField({
    id: 'overview.serviceProviderContactPerson',
    title: prerequisitesMessages.serviceProvider.contactPerson,
    items: getServiceProviderContactPersonItems,
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
    id: 'overview.memmEducation',
    title: memmMessages.education.subSectionTitle,
    backId: editable ? 'memm.education' : undefined,
    items: getMemmEducationItems,
    hideIfEmpty: true,
    condition: isKnowsNationalId,
  }),
  buildOverviewField({
    id: 'overview.memmReception',
    title: memmMessages.reception.subSectionTitle,
    backId: editable ? 'memm.reception' : undefined,
    items: getMemmReceptionItems,
    hideIfEmpty: true,
    condition: isKnowsNationalId,
  }),
  buildOverviewField({
    id: 'overview.memmCulture',
    title: memmMessages.culture.subSectionTitle,
    backId: editable ? 'memm.culture' : undefined,
    items: getMemmCultureItems,
    hideIfEmpty: true,
    condition: isKnowsNationalId,
  }),
  buildOverviewField({
    id: 'overview.memmWellbeing',
    title: memmMessages.wellbeing.subSectionTitle,
    backId: editable ? 'memm.wellbeing' : undefined,
    items: getMemmWellbeingItems,
    hideIfEmpty: true,
    condition: isKnowsNationalId,
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
    id: 'overview.reasonNotificationHistory',
    title: reasonForNotificationMessages.notificationHistory.subSectionTitle,
    backId: editable ? 'reasonNotificationHistory' : undefined,
    items: getReasonNotificationHistoryItems,
  }),
  buildOverviewField({
    id: 'overview.protectiveFactors',
    title: protectiveFactorsMessages.sectionTitle,
    backId: editable ? 'protectiveFactors' : undefined,
    items: getProtectiveFactorsItems,
    hideIfEmpty: true,
    condition: (answers) => !isUnborn(answers),
  }),
  buildOverviewField({
    id: 'overview.childSafety',
    title: childSafetyMessages.sectionTitle,
    backId: editable ? 'childSafety' : undefined,
    items: getChildSafetyItems,
    hideIfEmpty: true,
  }),
]

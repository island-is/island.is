import { buildOverviewField } from '@island.is/application/core'

import {
  childMessages,
  childSafetyMessages,
  memmMessages,
  parentsMessages,
  prerequisitesMessages,
  protectiveFactorsMessages,
  reasonForNotificationMessages,
} from '../lib/messages'
import { isKnowsNationalId, isNoNationalId, isUnborn } from './conditionUtils'
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
  getParentsPreItems,
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
    id: 'overview.parentsPre',
    title: ({ answers }) =>
      isUnborn(answers)
        ? parentsMessages.expectantParents.sectionTitle
        : isKnowsNationalId(answers) // TODO: Need to check if kerfiskennitala!
        ? parentsMessages.custodians.sectionTitle
        : parentsMessages.guardians.sectionTitle,
    backId: editable ? 'parents' : undefined,
    items: getParentsPreItems,
  }),
  buildOverviewField({
    id: 'overview.parent1',
    title: ({ answers }) =>
      isUnborn(answers)
        ? parentsMessages.expectantParents.parent1Title
        : isKnowsNationalId(answers) // TODO: Need to check if kerfiskennitala!
        ? parentsMessages.custodians.parent1Title
        : parentsMessages.guardians.parent1Title,
    backId: editable ? 'parents' : undefined,
    items: getParent1Items,
    hideIfEmpty: true,
  }),
  buildOverviewField({
    id: 'overview.parent2',
    title: ({ answers }) =>
      isUnborn(answers)
        ? parentsMessages.expectantParents.parent2Title
        : isKnowsNationalId(answers) // TODO: Need to check if kerfiskennitala!
        ? parentsMessages.custodians.parent2Title
        : parentsMessages.guardians.parent2Title,
    backId: editable ? 'parents' : undefined,
    items: getParent2Items,
    hideIfEmpty: true,
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
  }),
  buildOverviewField({
    id: 'overview.reasonNotificationHistory',
    title: reasonForNotificationMessages.notificationHistory.subSectionTitle,
    backId: editable ? 'reasonNotificationHistory' : undefined,
    items: getReasonNotificationHistoryItems,
  }),
  buildOverviewField({
    id: 'overview.protectiveFactors',
    title: protectiveFactorsMessages.shared.sectionTitle,
    backId: editable ? 'protectiveFactors' : undefined,
    items: getProtectiveFactorsItems,
    hideIfEmpty: true,
  }),
  buildOverviewField({
    id: 'overview.childSafety',
    title: childSafetyMessages.shared.sectionTitle,
    backId: editable ? 'childSafety' : undefined,
    items: getChildSafetyItems,
    hideIfEmpty: true,
  }),
]

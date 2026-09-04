import { buildOverviewField } from '@island.is/application/core'

import {
  childMessages,
  childSafetyMessages,
  parentsMessages,
  prerequisitesMessages,
  reasonForNotificationMessages,
} from '../lib/messages'
import {
  isKnowsNationalId,
  isNoNationalId,
  isUnborn,
  showParentsSection,
} from './conditionUtils'
import {
  getChildManualItems,
  getChildSafetyItems,
  getChildWithNationalIdItems,
  getNotifierInfoItems,
  getParent1Items,
  getParent2Items,
  getParentsPreItems,
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
    id: 'overview.parentsPre',
    title: ({ answers }) =>
      isUnborn(answers)
        ? parentsMessages.expectantParents.sectionTitle
        : isKnowsNationalId(answers)
        ? parentsMessages.custodians.sectionTitle
        : parentsMessages.guardians.sectionTitle,
    backId: editable ? 'parents' : undefined,
    items: getParentsPreItems,
    condition: showParentsSection,
  }),
  buildOverviewField({
    id: 'overview.parent1',
    title: ({ answers }) =>
      isUnborn(answers)
        ? parentsMessages.expectantParents.parent1Title
        : isKnowsNationalId(answers)
        ? parentsMessages.custodians.parent1Title
        : parentsMessages.guardians.parent1Title,
    backId: editable ? 'parents' : undefined,
    items: getParent1Items,
    hideIfEmpty: true,
    condition: showParentsSection,
  }),
  buildOverviewField({
    id: 'overview.parent2',
    title: ({ answers }) =>
      isUnborn(answers)
        ? parentsMessages.expectantParents.parent2Title
        : isKnowsNationalId(answers)
        ? parentsMessages.custodians.parent2Title
        : parentsMessages.guardians.parent2Title,
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
  }),
  buildOverviewField({
    id: 'overview.childSafety',
    title: childSafetyMessages.sectionTitle,
    backId: editable ? 'childSafety' : undefined,
    items: getChildSafetyItems,
    hideIfEmpty: true,
  }),
]

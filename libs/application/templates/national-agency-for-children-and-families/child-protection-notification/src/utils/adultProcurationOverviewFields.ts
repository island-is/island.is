import { buildOverviewField } from '@island.is/application/core'

import {
  childMessages,
  overviewMessages,
  parentsMessages,
  prerequisitesMessages,
  protectiveFactorsMessages,
} from '../lib/messages'
import { isKnowsNationalId, isNoNationalId, isUnborn } from './conditionUtils'
import {
  getChildManualItems,
  getChildWithNationalIdItems,
  getParent1Items,
  getParent2Items,
  getParentsPreItems,
  getProtectiveFactorsItems,
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
        : isKnowsNationalId(answers)
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
        : isKnowsNationalId(answers)
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
        : isKnowsNationalId(answers)
        ? parentsMessages.custodians.parent2Title
        : parentsMessages.guardians.parent2Title,
    backId: editable ? 'parents' : undefined,
    items: getParent2Items,
    hideIfEmpty: true,
  }),
  buildOverviewField({
    id: 'overview.protectiveFactors',
    title: protectiveFactorsMessages.shared.sectionTitle,
    backId: editable ? 'protectiveFactors' : undefined,
    items: getProtectiveFactorsItems,
    hideIfEmpty: true,
  }),
]

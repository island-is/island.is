import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'

import {
  childMessages,
  parentsMessages,
  overviewMessages,
  prerequisitesMessages,
} from '../../lib/messages'
import {
  isNoNationalId,
  isUnborn,
  isKnowsNationalId,
} from '../../utils/conditionUtils'
import {
  getChildManualItems,
  getChildWithNationalIdItems,
  getParent1Items,
  getParent2Items,
  getParentsPreItems,
  getServiceProviderContactPersonItems,
  getServiceProviderItems,
} from '../../utils/getOverviewItems'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overviewMessages.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: overviewMessages.sectionTitle,
      description: overviewMessages.description,
      children: [
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
          backId: 'childInfoManual',
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
          backId: 'parents',
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
          backId: 'parents',
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
          backId: 'parents',
          items: getParent2Items,
          hideIfEmpty: true,
        }),
        buildSubmitField({
          id: 'submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: overviewMessages.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})

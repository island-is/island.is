import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'

import {
  childMessages,
  expectantParentsMessages,
  overviewMessages,
  prerequisitesMessages,
} from '../../lib/messages'
import { isNoNationalId, isUnborn } from '../../utils/conditionUtils'
import {
  getChildManualItems,
  getChildWithNationalIdItems,
  getExpectantParent1Items,
  getExpectantParent2Items,
  getExpectantParentsPreItems,
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
          id: 'overview.expectantParentsPre',
          title: expectantParentsMessages.sectionTitle,
          backId: 'expectantParents',
          items: getExpectantParentsPreItems,
          condition: isUnborn,
        }),
        buildOverviewField({
          id: 'overview.expectantParent1',
          title: expectantParentsMessages.parent1Title,
          backId: 'expectantParents',
          items: getExpectantParent1Items,
          condition: isUnborn,
        }),
        buildOverviewField({
          id: 'overview.expectantParent2',
          title: expectantParentsMessages.parent2Title,
          backId: 'expectantParents',
          items: getExpectantParent2Items,
          condition: isUnborn,
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

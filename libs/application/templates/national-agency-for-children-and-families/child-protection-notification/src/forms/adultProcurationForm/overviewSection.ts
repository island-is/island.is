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
import { KnowsNationalId } from '../../utils/constants'
import { getApplicationAnswers } from '../../utils/getApplicationAnswers'
import { isNoNationalId, isUnborn } from '../../utils/conditionUtils'
import {
  getChildManualItems,
  getChildNoPreItems,
  getChildUnbornRadioItems,
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
          // TODO: Update when design is ready?
          id: 'overview.serviceProvider',
          title: prerequisitesMessages.serviceProvider.subSectionTitle,
          items: getServiceProviderItems,
        }),
        buildOverviewField({
          // TODO: Update when design is ready?
          id: 'overview.serviceProviderContactPerson',
          title: prerequisitesMessages.serviceProvider.contactPerson,
          items: getServiceProviderContactPersonItems,
        }),
        buildOverviewField({
          id: 'overview.childWithNationalId',
          title: childMessages.shared.sectionTitle,
          items: getChildWithNationalIdItems,
          condition: (answers) =>
            getApplicationAnswers(answers).childKnowsNationalId ===
            KnowsNationalId.YES,
        }),
        buildOverviewField({
          id: 'overview.childNoPre',
          title: childMessages.shared.sectionTitle,
          items: getChildNoPreItems,
          condition: isNoNationalId,
        }),
        buildOverviewField({
          id: 'overview.childManual',
          backId: 'childInfoManual',
          title: childMessages.manualInfo.sectionTitle,
          items: getChildManualItems,
          condition: isNoNationalId,
        }),
        buildOverviewField({
          id: 'overview.childUnbornRadio',
          title: childMessages.shared.sectionTitle,
          items: getChildUnbornRadioItems,
          condition: isUnborn,
        }),
        buildOverviewField({
          id: 'overview.expectantParentsPre',
          backId: 'expectantParents',
          title: expectantParentsMessages.sectionTitle,
          items: getExpectantParentsPreItems,
          condition: isUnborn,
        }),
        buildOverviewField({
          id: 'overview.expectantParent1',
          backId: 'expectantParents',
          title: expectantParentsMessages.parent1Title,
          items: getExpectantParent1Items,
          condition: isUnborn,
        }),
        buildOverviewField({
          id: 'overview.expectantParent2',
          backId: 'expectantParents',
          title: expectantParentsMessages.parent2Title,
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

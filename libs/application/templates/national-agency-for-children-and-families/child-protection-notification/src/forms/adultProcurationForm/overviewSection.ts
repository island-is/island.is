import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'

import {
  childMessages,
  expectantParentsMessages,
  overviewMessages,
  prerequisitesMessages,
} from '../../lib/messages'
import { KnowsNationalId } from '../../utils/constants'
import {
  getChildManualItems,
  getChildWithNationalIdItems,
  getExpectantParent1Items,
  getExpectantParent2Items,
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
            getValueViaPath(answers, 'child.knowsNationalId') ===
            KnowsNationalId.YES,
        }),
        buildOverviewField({
          id: 'overview.childManual',
          title: childMessages.shared.sectionTitle,
          items: getChildManualItems,
          condition: (answers) =>
            getValueViaPath(answers, 'child.knowsNationalId') ===
            KnowsNationalId.NO,
        }),
        buildOverviewField({
          id: 'overview.expectantParent1',
          title: expectantParentsMessages.shared.parent1Title,
          items: getExpectantParent1Items,
          condition: (answers) =>
            getValueViaPath(answers, 'child.knowsNationalId') ===
            KnowsNationalId.UNBORN,
        }),
        buildOverviewField({
          id: 'overview.expectantParent2',
          title: expectantParentsMessages.shared.parent2Title,
          items: getExpectantParent2Items,
          condition: (answers) =>
            getValueViaPath(answers, 'child.knowsNationalId') ===
            KnowsNationalId.UNBORN,
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

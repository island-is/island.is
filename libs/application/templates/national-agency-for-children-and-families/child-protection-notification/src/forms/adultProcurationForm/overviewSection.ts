import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'

import { overviewMessages, prerequisitesMessages } from '../../lib/messages'
import {
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

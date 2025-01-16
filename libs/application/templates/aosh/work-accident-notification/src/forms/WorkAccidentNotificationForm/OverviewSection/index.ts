import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { overview } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'addEmployeeMultiField',
      title: overview.general.moreInjuredTitle,
      description: overview.general.moreInjuredDescription,
      children: [
        buildCustomField({
          id: 'addEmployee',
          component: 'AddEmployee',
        }),
      ],
    }),
    buildMultiField({
      id: 'overview',
      title: overview.general.pageTitle,
      description: overview.general.description,
      children: [
        buildCustomField({
          id: 'overview',
          component: 'Overview',
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: overview.general.approveButton,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: overview.general.approveButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})

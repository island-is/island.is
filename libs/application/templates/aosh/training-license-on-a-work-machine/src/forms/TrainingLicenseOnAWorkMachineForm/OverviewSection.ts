import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { overview } from '../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection.multiField',
      title: overview.general.pageTitle,
      children: [
        buildCustomField({
          id: 'overview',
          title: '',
          component: 'Overview',
        }),
        buildDescriptionField({
          id: 'overviewSection.agreementText',
          title: '',
          description: overview.general.agreementText,
          titleVariant: 'h5',
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

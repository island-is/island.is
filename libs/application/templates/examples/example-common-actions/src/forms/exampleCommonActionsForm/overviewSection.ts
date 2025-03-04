import {
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildSubmitField,
  buildOverviewField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'

export const overviewSection = buildSection({
  id: 'overview',
  title: 'Overview',
  children: [
    buildMultiField({
      id: 'overviewMultiField',
      children: [
        buildDescriptionField({
          id: 'overview',
          title: 'Overview',
          description: 'Overview',
        }),
        buildOverviewField({
          id: 'overview',
          title: 'Overview',
          description: 'Overview',
          items: (
            _answers: FormValue,
            _externalData: ExternalData,
          ): Array<KeyValueItem> => [
            {
              width: 'full',
              keyText: 'Full width',
              valueText: 'Overview',
            },
          ],
          backId: 'externalDataSuccessTitle',
        }),
        buildSubmitField({
          id: 'submitApplication',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: 'Submit application',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})

import {
  buildSection,
  buildMultiField,
  buildSubmitField,
  buildOverviewField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { getOverviewItems } from '../../utils/overviewUtils'

export const overviewSection = buildSection({
  id: 'overview',
  title: 'Overview',
  children: [
    buildMultiField({
      id: 'overviewMultiField',
      title: 'BuildOverviewField',
      children: [
        buildOverviewField({
          id: 'overviewX',
          title: 'Upplýsingar um þig',
          description: m.overviewInfoDescripton2,
          backId: 'id-of-some-field-to-go-to',
          bottomLine: false,
          items: getOverviewItems,
        }),
        buildSubmitField({
          id: 'submitApplication',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.overviewSubmit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})

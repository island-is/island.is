import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { getOverviewItems } from '../../utils/getOverviewItems'
import { mainForm as m } from '../../lib/messages'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: m.overviewSection.title,
  children: [
    buildMultiField({
      id: 'overviewSectionMulti',
      title: m.overviewSection.title,
      description: m.overviewSection.description,
      children: [
        buildOverviewField({
          id: 'overviewField',
          backId: 'countryAndDateSectionMulti',
          bottomLine: false,
          items: getOverviewItems,
        }),
        buildSubmitField({
          id: 'submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: m.overviewSection.confirmApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})

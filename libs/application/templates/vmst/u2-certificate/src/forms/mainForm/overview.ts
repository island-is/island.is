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
  title: 'Yfirlit',
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: 'Yfirlit',
      description:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
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

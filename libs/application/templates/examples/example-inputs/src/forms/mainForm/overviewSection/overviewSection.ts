import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { m } from '../../../lib/messages'
import {
  getAttachmentsData,
  getOverviewItems,
  getOverviewLoadItems,
  getSumItems,
  getTableData,
} from '../../../utils/overviewUtils'

export const overviewSection = buildSection({
  id: 'overview',
  title: 'Overview',
  children: [
    buildMultiField({
      id: 'overviewMultiField',
      title: 'Overview',
      description: m.overviewDescriptionText,
      children: [
        buildOverviewField({
          id: 'overviewX',
          title: 'Upplýsingar um þig',
          description: m.overviewInfoDescripton,
          backId: 'tableRepeater',
          bottomLine: false,
          items: getOverviewItems,
        }),
        buildOverviewField({
          id: 'overviewXAsync',
          title: 'Async upplýsingar',
          backId: 'tableRepeater',
          bottomLine: false,
          loadItems: getOverviewLoadItems,
        }),
        buildOverviewField({
          id: 'overviewY',
          title: 'Summing up numbers',
          backId: 'fieldsRepeater',
          bottomLine: false,
          items: getSumItems,
        }),
        buildOverviewField({
          id: 'overviewZ',
          title: 'Table overview',
          backId: 'tableRepeater',
          tableData: getTableData,
        }),
        buildOverviewField({
          id: 'overviewXX',
          title: 'File overview',
          description: m.overviewFileDescription,
          backId: 'fieldsRepeater',
          bottomLine: true,
          attachments: getAttachmentsData,
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

import {
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildSubmitField,
  buildOverviewField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'
import {
  getAttachmentsData,
  getOverviewItems,
  getSumItems,
  getTableData,
} from '../../../utils/overviewUtils'

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
          description: m.overviewDescriptionText,
        }),
        buildOverviewField({
          id: 'overviewX',
          title: 'Upplýsingar um þig',
          description: m.overviewInfoDescripton,
          backId: 'testBack.id',
          bottomLine: false,
          items: getOverviewItems,
        }),
        buildOverviewField({
          id: 'overviewY',
          title: 'Summing up numbers',
          backId: 'testBack.id',
          bottomLine: false,
          items: getSumItems,
        }),
        buildOverviewField({
          id: 'overviewZ',
          title: 'Table overview',
          backId: 'testBack.id',
          tableData: getTableData,
        }),
        buildOverviewField({
          id: 'overviewXX',
          title: 'File overview',
          description: m.overviewFileDescription,
          backId: 'testBack.id',
          bottomLine: true,
          attachments: getAttachmentsData,
        }),
        buildSubmitField({
          id: 'submitApplication',
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

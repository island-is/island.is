import { SectionBuilder } from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { m } from '../../../lib/messages'
import {
  getAttachmentsData,
  getOverviewItems,
  getOverviewLoadItems,
  getSumItems,
  getTableData,
  getLoadTableData,
  getPaginatedSearchableTableData,
} from '../../../utils/overviewUtils'

export const overviewSection = new SectionBuilder('overview', 'Overview')
  .addPage('overviewMultiField', 'Overview', (page) => {
    page
      .setDescription(m.overviewDescriptionText)
      .addOverviewField('overviewX', 'Upplýsingar um þig', {
        description: m.overviewInfoDescripton,
        backId: 'tableRepeater',
        bottomLine: false,
        items: getOverviewItems,
      })
      .addOverviewField('overviewXAsync', 'Async upplýsingar', {
        backId: 'tableRepeater',
        bottomLine: false,
        loadItems: getOverviewLoadItems,
      })
      .addOverviewField('overviewY', 'Summing up numbers', {
        backId: 'fieldsRepeater',
        bottomLine: false,
        items: getSumItems,
      })
      .addOverviewField('overviewZ', 'Table overview', {
        backId: 'tableRepeater',
        tableData: getTableData,
      })
      .addOverviewField('overviewZAsync', 'Async Table overview', {
        backId: 'tableRepeater',
        loadTableData: getLoadTableData,
      })
      .addOverviewField(
        'overviewXXX',
        'Paginated searchable table edited and saved data overview',
        {
          backId: 'paginatedSearchableTableMultiField',
          bottomLine: false,
          tableData: getPaginatedSearchableTableData,
        },
      )
      .addOverviewField('overviewXX', 'File overview', {
        description: m.overviewFileDescription,
        backId: 'fieldsRepeater',
        bottomLine: true,
        attachments: getAttachmentsData,
      })
      .addSubmitField('submitApplication', '', {
        refetchApplicationAfterSubmit: true,
        actions: [
          {
            event: DefaultEvents.SUBMIT,
            name: m.overviewSubmit,
            type: 'primary',
          },
        ],
      })
  })
  .build()

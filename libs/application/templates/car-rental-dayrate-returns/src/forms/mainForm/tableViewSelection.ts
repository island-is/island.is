import {
  buildPaginatedSearchableTableField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { getDayRateTableRows } from '../../utils/dayRateTableUtils'
import { UploadSelection } from '../../utils/constants'
import { DayRateRecord } from '../../utils/types'

export const tableViewSelectionSection = buildSection({
  condition: (answers) => {
    const uploadSelectionValue =
      getValueViaPath<string>(answers, 'singleOrMultiSelectionRadio') ??
      UploadSelection.MULTI

    return uploadSelectionValue === UploadSelection.SINGLE
  },
  id: 'tableViewSelectionSection',
  title: m.tableView.sectionTitle,
  children: [
    buildMultiField({
      id: 'tableViewSelectionMultiField',
      title: m.tableView.multiTitle,
      children: [
        buildPaginatedSearchableTableField({
          id: 'vehicleDayRateUsageRows',
          doesNotRequireAnswer: true,
          rowIdKey: 'permno',
          rows: (application) => {
            return getDayRateTableRows(
              getValueViaPath<DayRateRecord[]>(
                application.externalData,
                'getPreviousPeriodDayRateReturns.data',
              ),
            )
          },
          headers: [
            {
              key: 'permno',
              label: m.tableView.tableHeaderPermno,
            },
            {
              key: 'prevPeriodTotalDays',
              label: m.tableView.tableHeaderTotalDays,
            },
            {
              key: 'prevPeriodUsage',
              label: m.tableView.tableHeaderUsedDays,
              editable: true,
              inputType: 'number',
              min: 0,
            },
          ],
          searchLabel: m.tableView.searchLabel,
          searchPlaceholder: m.tableView.searchPlaceholder,
          emptyState: m.tableView.emptyState,
          searchKeys: ['permno'],
        }),
      ],
    }),
  ],
})

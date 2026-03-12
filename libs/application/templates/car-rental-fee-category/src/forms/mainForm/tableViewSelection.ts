import {
  buildPaginatedSearchableTableField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { getManualMileageTableRows } from '../../utils/carCategoryUtils'
import { UploadSelection } from '../../utils/constants'

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
          id: 'vehicleLatestMilageRows',
          doesNotRequireAnswer: true,
          rowIdKey: 'permno',
          rows: (application) => {
            return getManualMileageTableRows(
              getValueViaPath(
                application.externalData,
                'getCurrentVehicles.data',
              ),
              getValueViaPath(
                application.externalData,
                'getCurrentVehiclesRateCategory.data',
              ),
              getValueViaPath(application.answers, 'categorySelectionRadio'),
            )
          },
          headers: [
            {
              key: 'permno',
              label: m.tableView.tableHeaderPermno,
            },
            {
              key: 'latestMilage',
              label: m.tableView.tableHeaderMileage,
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

import {
  buildPaginatedSearchableTableField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { getManualMileageTableRows } from '../../utils/carCategoryUtils'
import { RateCategory, UploadSelection } from '../../utils/constants'
import { CarMap } from '../../utils/types'

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
              getValueViaPath<CarMap>(
                application.externalData,
                'getVehicleCarMap.data',
              ),
              getValueViaPath<RateCategory>(
                application.answers,
                'categorySelectionRadio',
              ),
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
              placeholderKey: 'currentMilage',
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

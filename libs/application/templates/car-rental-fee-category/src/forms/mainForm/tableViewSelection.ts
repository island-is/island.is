import {
  buildPaginatedSearchableTableField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { EntryModel } from '@island.is/clients-rental-day-rate'
import { m } from '../../lib/messages'
import { buildCurrentCarMap } from '../../utils/carCategoryUtils'
import { RateCategory, UploadSelection } from '../../utils/constants'
import { CurrentVehicleWithMilage } from '../../utils/types'

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
            const vehicles =
              getValueViaPath<CurrentVehicleWithMilage[]>(
                application.externalData,
                'getCurrentVehicles.data',
              ) ?? []
            const rates =
              getValueViaPath<EntryModel[]>(
                application.externalData,
                'getCurrentVehiclesRateCategory.data',
              ) ?? []
            const rateToChangeTo = getValueViaPath<RateCategory>(
              application.answers,
              'categorySelectionRadio',
            )

            if (!rateToChangeTo) {
              return vehicles
                .filter(
                  (
                    vehicle,
                  ): vehicle is CurrentVehicleWithMilage & { permno: string } =>
                    Boolean(vehicle.permno),
                )
                .map((vehicle) => ({
                  permno: vehicle.permno,
                  latestMilage: undefined,
                }))
            }

            const currentCarMap = buildCurrentCarMap(vehicles, rates)

            return vehicles
              .filter((vehicle) => {
                if (!vehicle.permno) {
                  return false
                }

                const currentCar = currentCarMap[vehicle.permno]
                if (!currentCar) {
                  return false
                }

                return currentCar.category !== rateToChangeTo
              })
              .map((vehicle) => ({
                permno: vehicle.permno as string,
                latestMilage: undefined,
              }))
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
            },
          ],
          searchLabel: m.tableView.searchLabel,
          searchPlaceholder: m.tableView.searchPlaceholder,
          emptyState: m.tableView.emptyState,
          searchKeys: ['permno'],
          submitErrorMessage: m.tableView.submitErrorMessage,
        }),
      ],
    }),
  ],
})

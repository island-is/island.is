import {
  buildMultiField,
  buildSection,
  buildStaticTableField,
  getValueViaPath,
} from '@island.is/application/core'
import { EntryModel } from '@island.is/clients-rental-day-rate'
import { CurrentVehicleWithMilage } from '../../utils/types'
import { hasActiveDayRate } from '../../utils/dayRateUtils'

export const overviewStatistics = buildSection({
  id: 'overviewStatisticsSection',
  title: 'Yfirlit yfir bifreiðar',
  children: [
    buildMultiField({
      id: 'overviewStatisticsMultiField',
      title: 'Yfirlit yfir bifreiðar',
      children: [
        buildStaticTableField({
          header: ['Yfirlit', ''],
          rows: (application) => {
            const vehicles =
              getValueViaPath<Array<CurrentVehicleWithMilage>>(
                application.externalData,
                'getCurrentVehicles.data',
              ) ?? []

            const rates =
              getValueViaPath<Array<EntryModel>>(
                application.externalData,
                'getCurrentVehiclesRateCategory.data',
              ) ?? []

            return [
              ['Fjöldi bifreiða á skrá', vehicles.length.toString()],
              [
                'Fjöldi bifreiða á daggjaldi',
                rates
                  .filter(
                    (x) =>
                      x.dayRateEntries && hasActiveDayRate(x.dayRateEntries),
                  )
                  .length.toString(),
              ],
              [
                'Fjöldi bifreiða á kílómetragjaldi',
                rates
                  .filter(
                    (x) =>
                      !x.dayRateEntries || !hasActiveDayRate(x.dayRateEntries),
                  )
                  .length.toString(),
              ],
            ]
          },
        }),
      ],
    }),
  ],
})

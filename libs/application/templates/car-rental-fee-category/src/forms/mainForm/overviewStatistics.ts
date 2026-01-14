import {
  buildMultiField,
  buildSection,
  buildStaticTableField,
  getValueViaPath,
} from '@island.is/application/core'
import { EntryModel } from '@island.is/clients-rental-day-rate'
import { CurrentVehicleWithMilage } from '../../utils/types'
import { hasActiveDayRate } from '../../utils/dayRateUtils'
import { m } from '../../lib/messages'

export const overviewStatistics = buildSection({
  id: 'overviewStatisticsSection',
  title: m.overview.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewStatisticsMultiField',
      title: m.overview.multiTitle,
      children: [
        buildStaticTableField({
          header: [m.overview.header, ''],
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

            console.log('dayRates', rates)

            const dayRates =
              rates.filter(
                (x) => x.dayRateEntries && hasActiveDayRate(x.dayRateEntries),
              ).length ?? 0

            return [
              [m.overview.registeredCount, vehicles.length.toString()],
              [m.overview.dayRateCount, dayRates.toString()],
              [
                m.overview.kmRateCount,
                (vehicles.length - dayRates).toString(),
              ],
            ]
          },
        }),
      ],
    }),
  ],
})

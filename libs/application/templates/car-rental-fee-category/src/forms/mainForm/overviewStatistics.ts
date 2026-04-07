import {
  buildMultiField,
  buildSection,
  buildStaticTableField,
  getValueViaPath,
} from '@island.is/application/core'
import { CarMap } from '../../utils/types'
import { RateCategory } from '../../utils/constants'
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
            const carMap =
              getValueViaPath<CarMap>(
                application.externalData,
                'getVehicleCarMap.data',
              ) ?? {}

            const entries = Object.values(carMap)
            const total = entries.length
            const dayRates = entries.filter(
              (e) => e.category === RateCategory.DAYRATE,
            ).length

            return [
              [m.overview.registeredCount, total.toString()],
              [m.overview.dayRateCount, dayRates.toString()],
              [m.overview.kmRateCount, (total - dayRates).toString()],
            ]
          },
        }),
      ],
    }),
  ],
})

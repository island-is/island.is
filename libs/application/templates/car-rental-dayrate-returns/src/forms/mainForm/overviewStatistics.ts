import {
  buildMultiField,
  buildSection,
  buildStaticTableField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { DayRateRecord } from '../../utils/types'

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
            const rates =
              getValueViaPath<Array<DayRateRecord>>(
                application.externalData,
                'getPreviousPeriodDayRateReturns.data',
              ) ?? []

            const safeRates = Array.isArray(rates) ? rates : []
            const carsOnDayRateLastMonth = safeRates.length

            return [
              [
                m.overview.carsThatRequireAnswers,
                carsOnDayRateLastMonth.toString(),
              ],
            ]
          },
        }),
      ],
    }),
  ],
})

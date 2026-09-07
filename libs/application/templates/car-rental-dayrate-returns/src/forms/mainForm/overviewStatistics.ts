import {
  buildMultiField,
  buildSection,
  buildStaticTableField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { DayRateRecord } from '../../utils/types'
import { getEligibleDayRateRecords } from '../../utils/dayRateRecordUtils'

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
            const eligibleRates = getEligibleDayRateRecords(safeRates)
            const carsThatRequireAnswers = eligibleRates.length
            const carsAlreadyReported =
              safeRates.length - carsThatRequireAnswers

            return [
              [
                m.overview.carsThatRequireAnswers,
                carsThatRequireAnswers.toString(),
              ],
              ...(carsAlreadyReported > 0
                ? [
                    [
                      m.overview.carsAlreadyReported,
                      carsAlreadyReported.toString(),
                    ],
                  ]
                : []),
            ]
          },
        }),
      ],
    }),
  ],
})

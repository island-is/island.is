import {
  buildMultiField,
  buildSection,
  buildStaticTableField,
} from '@island.is/application/core'

export const overviewStatistics = buildSection({
  id: 'overviewStatisticsSection',
  title: 'Yfirlit yfir bifreiðar',
  children: [
    buildMultiField({
      id: 'overviewStatisticsMultiField',
      title: 'Yfirlit yfir bifreiðar',
      children: [
        buildStaticTableField({
          // Header, rows and summary can also be functions that access external data or answers
          header: [
            'Yfirlit',
            '',
          ],
          rows: [
            [
              'Fjöldi bifreiða á skrá',
              '222',
            ],
            [
              'Fjöldi bifreiða á daggjaldi',
              '111',
            ],
            [
              'Fjöldi bifreiða á kílómetragjaldi',
              '111',
            ],
          ],
        }),
      ],
    }),
  ],
})

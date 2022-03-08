import React, { FC } from 'react'
import { Table as T } from '@island.is/island-ui/core'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import cn from 'classnames'
import * as styles from './FinanceScheduleDetailTable.css'
import { tableStyles } from '@island.is/service-portal/core'
import { DetailedSchedule } from '@island.is/api/schema'
import { dateFormat } from '@island.is/shared/constants'
import { dateParse } from '../../utils/dateUtils'
import format from 'date-fns/format'

interface Props {
  data: Array<DetailedSchedule>
}

const FinanceScheduleDetailTable: FC<Props> = ({ data }) => {
  const { formatMessage } = useLocale()

  const headerArray = [
    {
      value: formatMessage({
        id: 'sp.finance-schedule:payment-number-short',
        defaultMessage: 'Afb.nr',
      }),
      align: 'left',
    },
    {
      value: formatMessage({
        id: 'sp.finance-schedule:planned-paid-date',
        defaultMessage: 'Gjalddagi',
      }),
      align: 'left',
    },
    {
      value: formatMessage({
        id: 'sp.finance-schedule:planned-amount',
        defaultMessage: 'Upphæð',
      }),
      align: 'left',
    },
    {
      value: formatMessage({
        id: 'sp.finance-schedule:paid-amount',
        defaultMessage: 'Uppsöfnuð greiðsla',
      }),
      align: 'left',
    },
    {
      value: formatMessage({
        id: 'sp.finance-schedule:paid-date',
        defaultMessage: 'Dagsetning greiðslu',
      }),
      align: 'left',
    },
  ]

  console.log('data from detail table', data)
  return (
    <Box className={styles.wrapper} background="white">
      <T.Table>
        <T.Head>
          <T.Row>
            {headerArray.map((item, i) => (
              <T.HeadData
                box={{
                  textAlign: item.align as 'right' | undefined,
                  paddingRight: 2,
                  paddingLeft: 2,
                }}
                key={i}
                text={{ truncate: true }}
                style={tableStyles}
              >
                <Text variant="medium" fontWeight="semiBold">
                  {item.value}
                </Text>
              </T.HeadData>
            ))}
          </T.Row>
        </T.Head>
        <T.Body>
          {data?.map((row, i) => (
            <T.Row key={i}>
              {[
                {
                  value: row.paymentNumber,
                  align: 'left',
                },
                {
                  value: row.plannedDate, //format(dateParse(row.plannedDate), dateFormat.is),
                  align: 'left',
                },
                { value: row.plannedAmount, align: 'left' },
                { value: row.paidAmount, align: 'left' },
                {
                  value: row.paidDate, // format(dateParse(row.paidDate), dateFormat.is),
                  align: 'left',
                },
              ].map((item, ii) => (
                <T.Data
                  box={{ paddingRight: 2, paddingLeft: 2 }}
                  key={ii}
                  style={tableStyles}
                >
                  <div
                    className={cn(styles.td, {
                      [styles.alignTd]: item.align === 'right' ? true : false,
                    })}
                  >
                    <Text variant="medium">{item.value}</Text>
                  </div>
                </T.Data>
              ))}
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
    </Box>
  )
}

export default FinanceScheduleDetailTable

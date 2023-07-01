import React, { FC } from 'react'
import { Table as T } from '@island.is/island-ui/core'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import cn from 'classnames'
import * as styles from './FinanceScheduleDetailTable.css'
import {
  tableStyles,
  amountFormat,
  dateParse,
} from '@island.is/service-portal/core'
import { DetailedSchedule } from '@island.is/api/schema'
import { dateFormat } from '@island.is/shared/constants'
import format from 'date-fns/format'
import { theme } from '@island.is/island-ui/theme'

interface Props {
  data: Array<DetailedSchedule>
}

type DetailData = Array<
  DetailedSchedule & {
    paid: boolean
  }
>

const FinanceScheduleDetailTable: FC<React.PropsWithChildren<Props>> = ({
  data,
}) => {
  const { formatMessage } = useLocale()
  useNamespaces('sp.finance-schedule')

  const headerArray = [
    { value: '' },
    {
      value: formatMessage({
        id: 'sp.finance-schedule:paid-detail-date',
        defaultMessage: 'Greiðsludagur',
      }),
      align: 'left',
    },
    {
      value: formatMessage({
        id: 'sp.finance-schedule:payment-explanation',
        defaultMessage: 'Skýring',
      }),
      align: 'left',
    },
    {
      value: formatMessage({
        id: 'sp.finance-schedule:amount',
        defaultMessage: 'Fjárhæð',
      }),
      align: 'right',
    },
    {
      value: formatMessage({
        id: 'sp.finance-schedule:detail-unpaid-no-interest',
        defaultMessage: 'Eftirstöðvar án vaxta',
      }),
      align: 'right',
    },
    {
      value: '',
    },
    {
      value: '',
    },
    {
      value: '',
    },
  ]

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
                key={i + item.value}
                text={{ truncate: true }}
                style={{ ...tableStyles, backgroundColor: theme.color.white }}
                color="white"
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
            <T.Row key={i + row.paymentNumber}>
              {[
                {
                  value: (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flexStart"
                      cursor="pointer"
                      className={styles.btnSpacer}
                    ></Box>
                  ),
                  element: true,
                },
                {
                  value: format(dateParse(row.paidDate), dateFormat.is),
                  align: 'left',
                },
                {
                  value: row.payExplanation,
                  align: 'left',
                },
                {
                  value: amountFormat(row.paidAmount),
                  align: 'right',
                },
                {
                  value: amountFormat(row.unpaidAmount),
                  align: 'right',
                },
                {
                  value: '',
                },
                {
                  value: '',
                },
                {
                  value: '',
                },
              ].map((item, ii) => (
                <T.Data
                  box={{ paddingRight: 2, paddingLeft: 2 }}
                  key={ii.toString() + item.value}
                  style={{ ...tableStyles, flex: '1 1 0px' }}
                  color="white"
                  borderColor="blue200"
                >
                  <div
                    className={cn(styles.td, {
                      [styles.alignTd]: item.align === 'right',
                      [styles.alignCenter]: item.align === 'center',
                    })}
                  >
                    <Text variant="medium" as={item.element ? 'span' : 'p'}>
                      {item.value}
                    </Text>
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

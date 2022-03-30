import React, { FC } from 'react'
import { Icon, Table as T, Tooltip } from '@island.is/island-ui/core'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
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

interface Props {
  data: Array<DetailedSchedule>
}

type DetailData = Array<
  DetailedSchedule & {
    paid: boolean
  }
>

const FinanceScheduleDetailTable: FC<Props> = ({ data }) => {
  const { formatMessage } = useLocale()

  const arr: DetailData = data.map((x, i) => {
    const sum =
      x.payments?.reduce(
        (sum: number, current: { payAmount: number }) =>
          sum + current.payAmount,
        0,
      ) || 0
    return {
      ...data[i],
      paid: sum >= x.plannedAmount ? true : false,
    }
  })
  const headerArray = [
    {
      value: formatMessage({
        id: 'sp.finance-schedule:scheduled-paid-date',
        defaultMessage: 'Gjalddagi',
      }),
      align: 'left',
    },
    {
      value: formatMessage({
        id: 'sp.finance-schedule:scheduled-paymend',
        defaultMessage: 'Áætlun',
      }),
      align: 'left',
    },
    { value: '' },
    {
      value: formatMessage({
        id: 'sp.finance-schedule:paid-amount',
        defaultMessage: 'Greitt',
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
    {
      value: formatMessage({
        id: 'sp.finance-schedule:is-paid',
        defaultMessage: 'Greiðslu lokið',
      }),
      align: 'center',
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
          {arr?.map((row, i) => (
            <T.Row key={i + row.paymentNumber}>
              {[
                {
                  value: format(dateParse(row.plannedDate), dateFormat.is),
                  align: 'left',
                },
                {
                  value: (
                    <Box display="flex">
                      {amountFormat(row.plannedAmount)}
                      {i === arr.length - 1 ? (
                        <Tooltip
                          placement="bottom"
                          text={formatMessage({
                            id: 'sp.finance-schedule:last-payment-info',
                            defaultMessage:
                              'Vextir uppfærast daglega á líftíma greiðsluáætlunarinnar en eru greiddir á síðasta gjalddaga.',
                          })}
                        />
                      ) : null}
                    </Box>
                  ),
                  element: true,
                  align: 'left',
                },
                { value: '' },
                {
                  value:
                    row.paidAmount === 0 ? '' : amountFormat(row.paidAmount),
                  align: 'left',
                },
                {
                  value: row.paidDate.includes('*')
                    ? row.payments &&
                      format(
                        dateParse(
                          row.payments[row.payments.length - 1].payDate,
                        ),
                        dateFormat.is,
                      )
                    : row.paidDate.length <= 0
                    ? ''
                    : format(dateParse(row.paidDate), dateFormat.is),
                  align: 'left',
                },
                {
                  value: row.paid ? (
                    <Box
                      marginRight={1}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      textAlign="center"
                    >
                      <Icon
                        icon="checkmarkCircle"
                        color="mint600"
                        type="filled"
                      />
                    </Box>
                  ) : (
                    ''
                  ),
                  element: true,
                  align: 'center',
                },
              ].map((item, ii) => (
                <T.Data
                  box={{ paddingRight: 2, paddingLeft: 2 }}
                  key={ii.toString() + item.value}
                  style={tableStyles}
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

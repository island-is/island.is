import React, { FC, ReactElement } from 'react'
import { Icon, Table as T } from '@island.is/island-ui/core'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import cn from 'classnames'
import * as styles from './FinanceScheduleDetailTable.css'
import { tableStyles } from '@island.is/service-portal/core'
import { AccumulatedPayments, DetailedSchedule } from '@island.is/api/schema'
import { dateFormat } from '@island.is/shared/constants'
import { dateParse } from '../../utils/dateUtils'
import format from 'date-fns/format'
import amountFormat from '../../utils/amountFormat'
import compare from 'date-fns/compareAsc'
import { parseWithOptions } from 'date-fns/fp'
interface Props {
  data: Array<DetailedSchedule>
}

type DetailData = Array<
  DetailedSchedule & {
    paid: boolean
    paymentsElement: ReactElement | undefined | null
  }
>

const FinanceScheduleDetailTable: FC<Props> = ({ data }) => {
  const { formatMessage } = useLocale()

  const payments = (payments: AccumulatedPayments[] | undefined) => {
    if (!payments || payments.length < 2) return

    return payments.map((payment, i) => {
      const isLast = i === payments.length - 1
      console.log(payment)
      console.log(isLast)
      return (
        <T.Row>
          <T.Data
            borderColor={isLast ? 'blue200' : 'transparent'}
            box={{ paddingX: 2 }}
            style={tableStyles}
          ></T.Data>
          <T.Data
            borderColor={isLast ? 'blue200' : 'transparent'}
            box={{ paddingX: 2 }}
            style={tableStyles}
          ></T.Data>
          {payment.payExplanation && payment.payExplanation !== 'Greiðsla' ? (
            <T.Data
              borderColor={isLast ? 'blue200' : 'transparent'}
              box={{ paddingX: 2 }}
              style={tableStyles}
            >
              <Text variant="medium" fontWeight="semiBold">
                Skýring
              </Text>
              <Text variant="medium">{payment.payExplanation}</Text>
            </T.Data>
          ) : (
            <T.Data
              borderColor={isLast ? 'blue200' : 'transparent'}
              box={{ paddingX: 2 }}
              style={tableStyles}
            ></T.Data>
          )}
          <T.Data
            borderColor={isLast ? 'blue200' : 'transparent'}
            box={{ paddingX: 2 }}
            style={tableStyles}
          >
            <Text variant="medium">{amountFormat(payment.payAmount)}</Text>
          </T.Data>
          <T.Data
            borderColor={isLast ? 'blue200' : 'transparent'}
            box={{ paddingX: 2 }}
            style={tableStyles}
          >
            <Text variant="medium">
              {format(dateParse(payment.payDate), dateFormat.is)}
            </Text>
          </T.Data>
          <T.Data
            borderColor={isLast ? 'blue200' : 'transparent'}
            box={{ paddingX: 2 }}
            style={tableStyles}
          ></T.Data>
        </T.Row>
      )
    })
  }

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
      paymentsElement:
        data[i].payments && payments(data[i].payments ?? undefined),
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
          {arr?.map((row, i) => (
            <>
              <T.Row key={i}>
                {[
                  {
                    value: format(dateParse(row.plannedDate), dateFormat.is),
                    align: 'left',
                    border: !row.paidDate.includes('*'),
                  },
                  {
                    value: amountFormat(row.plannedAmount),
                    align: 'left',
                    border: !row.paidDate.includes('*'),
                  },
                  { value: '', border: !row.paidDate.includes('*') },
                  {
                    value:
                      row.paidAmount === 0 ? '' : amountFormat(row.paidAmount),
                    align: 'left',
                    border: !row.paidDate.includes('*'),
                  },
                  {
                    value: row.paidDate.includes('*')
                      ? row.paidDate
                      : row.paidDate.length <= 0
                      ? ''
                      : format(dateParse(row.paidDate), dateFormat.is),
                    align: 'left',
                    border: !row.paidDate.includes('*'),
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
                    align: 'center',
                    border: !row.paidDate.includes('*'),
                  },
                ].map((item, ii) => (
                  <T.Data
                    box={{ paddingRight: 2, paddingLeft: 2 }}
                    key={ii}
                    style={tableStyles}
                    borderColor={item.border ? 'blue200' : 'transparent'}
                  >
                    <div
                      className={cn(styles.td, {
                        [styles.alignTd]: item.align === 'right',
                        [styles.alignCenter]: item.align === 'center',
                      })}
                    >
                      <Text variant="medium">{item.value}</Text>
                    </div>
                  </T.Data>
                ))}
              </T.Row>
              {row.paymentsElement && row.paymentsElement}
            </>
          ))}
        </T.Body>
      </T.Table>
    </Box>
  )
}

export default FinanceScheduleDetailTable

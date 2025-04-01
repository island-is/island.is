import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import {
  EmptyTable,
  MONTHS,
  amountFormat,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { m } from '../../lib/messages'
import { useGetPaymentPlanQuery } from '../PaymentGroupTable/PaymentGroupTable.generated'
import {
  Box,
  Button,
  LoadingDots,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useCallback, useRef, useState } from 'react'
import { Height } from 'react-animate-height'
import * as styles from './PaymentGroupTable.css'

export const PaymentGroupTable = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()
  const [expanded, toggleExpand] = useState<boolean>(false)
  const [closed, setClosed] = useState<boolean>(true)
  const tableRef = useRef<HTMLDivElement>(null)

  const handleAnimationEnd = useCallback((height: Height) => {
    if (height === 0) {
      setClosed(true)
    } else {
      setClosed(false)
    }
  }, [])

  const onExpandButton = () => {
    toggleExpand(!expanded)
  }

  const { data, loading, error } = useGetPaymentPlanQuery()

  if (error && !loading) {
    return <Problem noBorder={false} size="small" />
  }

  const paymentPlan = data?.socialInsurancePaymentPlan

  if (!error && !paymentPlan) {
    return (
      <EmptyTable
        loading={loading}
        message={formatMessage(m.noPaymentsFound)}
      />
    )
  }

  const paymentGroups = paymentPlan?.paymentGroups ?? []

  return (
    <Box ref={tableRef}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData
              box={{
                className: styles.labelColumn,
                background: 'blue100',
              }}
            >
              <Box className={styles.labelCell} paddingLeft={7}>
                <Text variant="medium" fontWeight="medium">
                  {formatMessage(m.type)}
                </Text>
              </Box>
            </T.HeadData>
            {MONTHS.map((month) => (
              <T.HeadData
                key={`table-header-col-${month}`}
                box={{
                  background: 'blue100',
                }}
                align="right"
              >
                <Text variant="medium" fontWeight="medium">
                  {formatMessage(
                    coreMessages[month as keyof typeof coreMessages],
                  )}
                </Text>
              </T.HeadData>
            ))}
            <T.HeadData
              box={{
                className: styles.sumColumn,
                background: 'blue100',
              }}
            >
              <Text textAlign="right" variant="medium" fontWeight="medium">
                {formatMessage(m.year)}
              </Text>
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {paymentGroups?.map((paymentGroup, rowIdx) => {
            return (
              <T.Row key={`row-${rowIdx}`}>
                <T.Data
                  box={{
                    className: styles.labelColumn,
                    background: 'white',
                  }}
                >
                  <Box display="flex">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flexStart"
                      onClick={onExpandButton}
                      cursor="pointer"
                      paddingRight={4}
                    >
                      <Button
                        circle
                        colorScheme="light"
                        icon={expanded ? 'remove' : 'add'}
                        iconType="filled"
                        onClick={onExpandButton}
                        preTextIconType="filled"
                        size="small"
                        title={'Sundurliðun'}
                        type="button"
                        variant="primary"
                      />
                    </Box>
                    <Text variant="medium">{paymentGroup.name}</Text>
                  </Box>
                </T.Data>
                {MONTHS.map((month, i) => {
                  const amount = paymentGroup?.monthlyPaymentHistory?.find(
                    (mph) => mph.monthIndex === MONTHS.indexOf(month),
                  )?.amount

                  return (
                    <T.Data
                      key={i}
                      box={{
                        background: 'white',
                      }}
                      align="right"
                    >
                      <Text variant="medium">
                        {amount ? amountFormat(amount) : '-'}
                      </Text>
                    </T.Data>
                  )
                })}
                <T.Data
                  box={{
                    className: styles.sumColumn,
                    background: 'white',
                  }}
                >
                  <Text variant="medium">{`${amountFormat(
                    paymentGroup.totalYearCumulativeAmount,
                  )}`}</Text>
                </T.Data>
              </T.Row>
            )
          })}
          <T.Row>
            <T.Data
              box={{
                className: styles.labelColumn,
                paddingY: 1,
                paddingX: 2,
                background: 'white',
              }}
            >
              <Box paddingLeft={7}>
                <Text variant="medium" fontWeight="medium">
                  {formatMessage(m.totalPaymentsReceived)}
                </Text>
              </Box>
            </T.Data>
            {MONTHS.map((month) => {
              const amount = paymentPlan?.totalMonthlyPaymentHistory?.find(
                (mph) => mph.monthIndex === MONTHS.indexOf(month),
              )?.amount
              return (
                <T.Data key={`nested-table-footer-col-${month}`}>
                  <Text variant="medium" fontWeight="medium" textAlign="right">
                    {amount ? amountFormat(amount) : '-'}
                  </Text>
                </T.Data>
              )
            })}
            <T.Data>
              <Text variant="medium" fontWeight="medium">
                {paymentPlan?.totalPaymentsReceived
                  ? amountFormat(paymentPlan?.totalPaymentsReceived)
                  : '-'}
              </Text>
            </T.Data>
          </T.Row>
        </T.Body>
      </T.Table>
    </Box>
  )
}

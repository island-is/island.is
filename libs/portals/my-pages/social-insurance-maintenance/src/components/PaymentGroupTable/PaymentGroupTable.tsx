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
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { useRef } from 'react'
import * as styles from './PaymentGroupTable.css'
import { PaymentGroupTableRow } from './PaymentGroupTableRow'
import { SocialInsurancePaymentGroupType } from '@island.is/api/schema'

export const PaymentGroupTable = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()
  const tableRef = useRef<HTMLDivElement>(null)

  const { data, loading, error } = useGetPaymentPlanQuery()

  if (error && !loading) {
    return <Problem noBorder={false} size="small" />
  }

  const paymentPlan = data?.socialInsurancePaymentPlan

  const paymentGroups =
    paymentPlan?.paymentGroups?.filter(
      (p) => p.type !== SocialInsurancePaymentGroupType.PAID,
    ) ?? []

  const paidOut = paymentPlan?.paymentGroups?.find(
    (pg) => pg.type === SocialInsurancePaymentGroupType.PAID,
  )

  if (!error && !paidOut) {
    return (
      <EmptyTable
        loading={loading}
        message={formatMessage(m.noPaymentsFound)}
      />
    )
  }

  return (
    <Box ref={tableRef}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData
              scope="col"
              box={{
                className: styles.rowLabelColumnCell,
                background: 'blue100',
              }}
            >
              <Box className={styles.rowLabelColumnCellBox} paddingLeft={7}>
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
                scope="col"
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
                className: styles.lastColumnCell,
                background: 'blue100',
              }}
              scope="col"
            >
              <Text textAlign="right" variant="medium" fontWeight="medium">
                {formatMessage(m.year)}
              </Text>
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {paymentGroups?.map((paymentGroup, idx) => (
            <PaymentGroupTableRow
              key={`payment-group-table-row-${paymentGroup.name}-${idx}`}
              paymentGroup={paymentGroup}
            />
          ))}
          <T.Row>
            <T.HeadData
              box={{
                className: styles.rowLabelColumnCell,
                background: 'white',
              }}
              scope="row"
            >
              <Box paddingLeft={7}>
                <Text variant="medium" fontWeight="medium">
                  {formatMessage(m.totalPaymentsReceived)}
                </Text>
              </Box>
            </T.HeadData>
            {MONTHS.map((month) => {
              const amount = paidOut?.monthlyPaymentHistory?.find(
                (mph) => mph.monthIndex === MONTHS.indexOf(month) + 1,
              )?.amount
              return (
                <T.Data key={`nested-table-footer-col-${month}`}>
                  <Text variant="medium" fontWeight="medium" textAlign="right">
                    {amount ? amountFormat(amount) : '-'}
                  </Text>
                </T.Data>
              )
            })}
            <T.Data
              box={{
                className: styles.lastColumnCell,
                background: 'white',
              }}
            >
              <Text variant="medium" fontWeight="medium" textAlign="right">
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

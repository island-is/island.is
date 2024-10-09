import { SocialInsurancePaymentGroupType } from '@island.is/api/schema'
import { Table, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import {
  EmptyTable,
  ExpandHeader,
  amountFormat,
} from '@island.is/portals/my-pages/core'
import { m } from '../../lib/messages'
import { useGetPaymentPlanQuery } from './PaymentGroupTable.generated'
import { PaymentGroupTableRow } from './PaymentGroupTableRow'

export const PaymentGroupTable = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetPaymentPlanQuery()

  if (error && !loading) {
    return <Problem noBorder={false} size="small" />
  }

  return (
    <>
      <Table.Table>
        <ExpandHeader
          data={[
            { value: '', printHidden: true },
            { value: formatMessage(m.paymentTypes) },
            {
              value: formatMessage(m.yearCumulativeTotal),
              align: 'right',
            },
          ]}
        />

        {!loading && !error && data?.socialInsurancePaymentPlan && (
          <Table.Body>
            {data.socialInsurancePaymentPlan?.paymentGroups
              ?.filter(
                (pg) => pg.type === SocialInsurancePaymentGroupType.PAYMENTS,
              )
              .map((pg, idx) => (
                <PaymentGroupTableRow
                  key={`payment-group-idx-${idx}`}
                  data={pg}
                  formatMessage={formatMessage}
                />
              ))}
            <Table.Row>
              <Table.Data colSpan={2}>
                <Text fontWeight="semiBold">
                  {formatMessage(m.paymentsTotal)}
                </Text>
              </Table.Data>
              <Table.Data align="right" colSpan={2}>
                <Text fontWeight="semiBold">
                  {amountFormat(data.socialInsurancePaymentPlan?.totalPayments)}
                </Text>
              </Table.Data>
            </Table.Row>
            {data.socialInsurancePaymentPlan?.paymentGroups
              ?.filter(
                (pg) => pg.type === SocialInsurancePaymentGroupType.SUBTRACTION,
              )
              .map((pg, idx) => (
                <PaymentGroupTableRow
                  key={`payment-group-idx-subtraction-${idx}`}
                  data={pg}
                  formatMessage={formatMessage}
                />
              ))}
            <Table.Row>
              <Table.Data align="left" colSpan={2}>
                <Text fontWeight="semiBold">
                  {formatMessage(m.paymentsReceived)}
                </Text>
              </Table.Data>
              <Table.Data align="right">
                <Text fontWeight="semiBold">
                  {amountFormat(
                    data.socialInsurancePaymentPlan?.totalPaymentsReceived,
                  )}
                </Text>
              </Table.Data>
            </Table.Row>
          </Table.Body>
        )}
      </Table.Table>
      {!error && !data?.socialInsurancePaymentPlan && (
        <EmptyTable
          loading={loading}
          message={formatMessage(m.noPaymentsFound)}
        />
      )}
    </>
  )
}

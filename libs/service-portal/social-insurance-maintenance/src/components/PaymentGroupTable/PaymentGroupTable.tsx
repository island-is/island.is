import { Text, Table, LoadingDots } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  EmptyTable,
  ExpandHeader,
  amountFormat,
} from '@island.is/service-portal/core'
import { SocialInsurancePaymentGroupType } from '@island.is/api/schema'
import { PaymentGroupTableRow } from '..'
import { useGetPaymentPlanQuery } from './PaymentGroupTable.generated'
import { Problem } from '@island.is/react-spa/shared'

type Props = {
  selectedYear: number
  parentLoading?: boolean
}

export const PaymentGroupTable = ({ selectedYear, parentLoading }: Props) => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()

  const {
    data,
    loading: dataLoading,
    error,
  } = useGetPaymentPlanQuery({
    variables: {
      input: {
        year: selectedYear,
      },
    },
  })

  const loading = dataLoading ?? parentLoading

  if (!error && loading) {
    return <EmptyTable loading={loading} />
  }

  if (error && !loading) {
    return <Problem noBorder={false} size="small" />
  }

  if (!error && !loading && !data?.socialInsurancePaymentPlan) {
    return <EmptyTable message={'No data'} />
  }

  return (
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
      <Table.Body>
        {data?.socialInsurancePaymentPlan?.paymentGroups
          ?.filter((pg) => pg.type === SocialInsurancePaymentGroupType.PAYMENTS)
          .map((pg, idx) => (
            <PaymentGroupTableRow
              key={`payment-group-idx-${idx}`}
              data={pg}
              formatMessage={formatMessage}
            />
          ))}
        <Table.Row>
          <Table.Data colSpan={2}>
            <Text fontWeight="semiBold">{formatMessage(m.paymentsTotal)}</Text>
          </Table.Data>
          <Table.Data align="right" colSpan={2}>
            <Text fontWeight="semiBold">
              {amountFormat(data?.socialInsurancePaymentPlan?.totalPayments)}
            </Text>
          </Table.Data>
        </Table.Row>
        {data?.socialInsurancePaymentPlan?.paymentGroups
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
                data?.socialInsurancePaymentPlan?.totalPaymentsReceived,
              )}
            </Text>
          </Table.Data>
        </Table.Row>
      </Table.Body>
    </Table.Table>
  )
}

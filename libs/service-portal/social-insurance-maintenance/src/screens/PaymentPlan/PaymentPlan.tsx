import { useLocale, useNamespaces } from '@island.is/localization'
import { useGetPaymentPlanLazyQuery } from './PaymentPlan.generated'
import {
  ExpandHeader,
  FootNote,
  IntroHeader,
  amountFormat,
  generateYears,
} from '@island.is/service-portal/core'
import { Problem } from '@island.is/react-spa/shared'
import {
  Box,
  Text,
  Table,
  Select,
  Stack,
  Divider,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { UserInfoLine, m as coreMessages } from '@island.is/service-portal/core'
import { m } from '../../lib/messages'
import { useEffect, useMemo, useState } from 'react'
import addYears from 'date-fns/addYears'
import { PaymentGroupTableRow } from '../../components'

const PaymentPlan = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()

  const [getPaymentPlanQuery, { data, loading, error }] =
    useGetPaymentPlanLazyQuery()

  const yearOptions = useMemo(() => {
    const years = generateYears(addYears(new Date(), -120), new Date(), 'desc')
    return years.map((y) => ({ value: y, label: y.toString() }))
  }, [])

  const [selectedYear, setSelectedYear] = useState(yearOptions[0])

  useEffect(() => {
    getPaymentPlanQuery({
      variables: { input: { year: selectedYear.value } },
    })
  }, [selectedYear, getPaymentPlanQuery])

  const totalPaymentsReceived =
    data?.socialInsurancePaymentPlan?.paymentGroups
      .filter((pg) => pg.type !== 'Frádráttur')
      .reduce(
        (total, current) => (total += current.totalYearCumulativeAmount),
        0,
      ) ?? 0

  const totalAmountSubtracted =
    data?.socialInsurancePaymentPlan?.paymentGroups
      .filter((pg) => pg.type === 'Frádráttur')
      .reduce(
        (total, current) => (total += current.totalYearCumulativeAmount),
        0,
      ) ?? 0

  return (
    <Box>
      <IntroHeader
        title={formatMessage(coreMessages.socialInsuranceMaintenance)}
        intro={formatMessage(
          coreMessages.socialInsuranceMaintenanceDescription,
        )}
        fixedImgWidth
        serviceProviderSlug={'tryggingastofnun'}
        serviceProviderTooltip={formatMessage(
          coreMessages.socialInsuranceTooltip,
        )}
      />
      {error && !loading ? (
        <Problem error={error} type="internal_service_error" noBorder={false} />
      ) : !error && !loading && !data?.socialInsurancePaymentPlan ? (
        <Problem type="no_data" noBorder={false} />
      ) : (
        <>
          <Box>
            <Stack space={1}>
              <UserInfoLine
                label={formatMessage(m.nextPayment)}
                content={
                  data?.socialInsurancePaymentPlan?.nextPayment
                    ? amountFormat(data.socialInsurancePaymentPlan.nextPayment)
                    : ''
                }
                loading={loading}
              />
              <Divider />
              <UserInfoLine
                label={formatMessage(m.previousMonthsPayment)}
                content={
                  data?.socialInsurancePaymentPlan?.previousPayment
                    ? amountFormat(
                        data.socialInsurancePaymentPlan.previousPayment,
                      )
                    : ''
                }
                loading={loading}
              />
              <Divider />
            </Stack>
            <Text marginTop={[2, 2, 6]} marginBottom={2} variant="h5">
              {formatMessage(coreMessages.period)}
            </Text>
            <Box printHidden marginBottom={3}>
              <GridContainer>
                <GridRow alignItems="flexEnd">
                  <GridColumn span={'3/8'}>
                    <Select
                      backgroundColor="blue"
                      size="xs"
                      options={yearOptions}
                      label={formatMessage(coreMessages.year)}
                      onChange={(ev) => {
                        if (ev?.value) {
                          setSelectedYear(ev)
                        }
                      }}
                      value={selectedYear}
                    />
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </Box>

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
                  .filter((pg) => pg.type !== 'Frádráttur')
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
                      {amountFormat(totalPaymentsReceived)}
                    </Text>
                  </Table.Data>
                </Table.Row>
                {data?.socialInsurancePaymentPlan?.paymentGroups
                  .filter((pg) => pg.type === 'Frádráttur')
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
                        totalPaymentsReceived - totalAmountSubtracted,
                      )}
                    </Text>
                  </Table.Data>
                </Table.Row>
              </Table.Body>
            </Table.Table>
          </Box>
          <Box>
            <Text variant="small" marginTop={5} marginBottom={2}>
              {formatMessage(m.maintenanceFooter)}
            </Text>
          </Box>
        </>
      )}
      <FootNote serviceProviderSlug="tryggingastofnun" />
    </Box>
  )
}

export default PaymentPlan

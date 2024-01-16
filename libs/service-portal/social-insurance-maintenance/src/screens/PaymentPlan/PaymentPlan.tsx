import { useLocale, useNamespaces } from '@island.is/localization'
import {
  GetPaymentPlanQuery,
  useGetPaymentPlanLazyQuery,
} from './PaymentPlan.generated'
import {
  ExpandHeader,
  amountFormat,
  generateYears,
} from '@island.is/service-portal/core'
import { Problem } from '@island.is/react-spa/shared'
import {
  Box,
  Text,
  Button,
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
import { PaymentPlanWrapper } from './wrapper/wrapper/PaymentPlanWrapper'
import { SocialInsuranceMaintenancePaths } from '../../lib/paths'

const PaymentPlan = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()

  /*const [getPaymentPlanQuery, { data, loading, error }] =
    useGetPaymentPlanLazyQuery()*/

  const yearOptions = useMemo(() => {
    const years = generateYears(addYears(new Date(), -120), new Date(), 'desc')
    return years.map((y) => ({ value: y, label: y.toString() }))
  }, [])

  const [selectedYear, setSelectedYear] = useState(yearOptions[0])
  /*
  useEffect(() => {
    getPaymentPlanQuery({
      variables: { input: { year: selectedYear.value } },
    })
  }, [selectedYear, getPaymentPlanQuery])*/

  const error = undefined
  const loading = false

  if (error) {
    return <Problem type="internal_service_error" error={error} />
  }

  const data: GetPaymentPlanQuery = {
    socialInsurancePaymentPlan: {
      nextPayment: 9000000,
      previousPayment: 6486834,
      paymentGroups: [
        {
          __typename: 'SocialInsurancePaymentGroup',
          type: 'Bing bong',
          totalYearCumulativeAmount: 126890409,
          payments: [
            {
              type: 'slung',
              monthlyPaymentHistory: [
                {
                  monthIndex: 3,
                  amount: 900000,
                },
              ],
              totalYearCumulativeAmount: 40000,
            },
            {
              type: 'kloing',
              monthlyPaymentHistory: [
                {
                  monthIndex: 5,
                  amount: 1,
                },
              ],
              totalYearCumulativeAmount: 90930000,
            },
          ],
          monthlyPaymentHistory: [
            {
              monthIndex: 1,
              amount: 80,
            },
            {
              monthIndex: 8,
              amount: 4578,
            },
          ],
        },
        {
          __typename: 'SocialInsurancePaymentGroup',
          type: 'Donko bonk',
          totalYearCumulativeAmount: 78489,
          payments: [
            {
              type: 'xyz',
              monthlyPaymentHistory: [
                {
                  monthIndex: 1,
                  amount: 450000,
                },
              ],
              totalYearCumulativeAmount: 2,
            },
            {
              type: 'klaxinbor',
              monthlyPaymentHistory: [
                {
                  monthIndex: 8,
                  amount: -784593,
                },
              ],
              totalYearCumulativeAmount: 909462430000,
            },
          ],
          monthlyPaymentHistory: [
            {
              monthIndex: 1,
              amount: 80,
            },
            {
              monthIndex: 8,
              amount: 4578,
            },
          ],
        },
      ],
    },
  }

  return (
    <PaymentPlanWrapper
      pathname={
        SocialInsuranceMaintenancePaths.SocialInsuranceMaintenancePaymentPlan
      }
      loading={loading}
      error={error}
    >
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
              ? amountFormat(data.socialInsurancePaymentPlan.previousPayment)
              : ''
          }
          loading={loading}
        />
        <Divider />
      </Stack>
      <Text marginTop={[2, 2, 6]} marginBottom={2} variant="h5">
        {formatMessage(coreMessages.period)}
      </Text>
      <Box marginBottom={3}>
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
            <GridColumn>
              <Button
                size="small"
                variant="utility"
                icon="print"
                onClick={() => console.log('clicked print')}
              >
                {formatMessage(coreMessages.print)}
              </Button>
            </GridColumn>
            <GridColumn>
              <Button
                size="small"
                variant="utility"
                icon="download"
                iconType="outline"
                onClick={() => console.log('clicked download')}
              >
                {formatMessage(coreMessages.getDocument)}
              </Button>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>

      <Table.Table>
        <ExpandHeader
          data={[
            { value: '' },
            { value: formatMessage(m.paymentTypes) },
            { value: formatMessage(m.yearCumulativeTotal), align: 'right' },
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
                {amountFormat(
                  data?.socialInsurancePaymentPlan?.paymentGroups
                    .filter((pg) => pg.type !== 'Frádráttur')
                    .reduce(
                      (total, current) =>
                        (total += current.totalYearCumulativeAmount),
                      0,
                    ) ?? 0,
                )}
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
                  data?.socialInsurancePaymentPlan?.paymentGroups
                    .filter((pg) => pg.type === 'Frádráttur')
                    .reduce(
                      (total, current) =>
                        (total += current.totalYearCumulativeAmount),
                      0,
                    ) ?? 0,
                )}
              </Text>
            </Table.Data>
          </Table.Row>
        </Table.Body>
      </Table.Table>
    </PaymentPlanWrapper>
  )
}

export default PaymentPlan

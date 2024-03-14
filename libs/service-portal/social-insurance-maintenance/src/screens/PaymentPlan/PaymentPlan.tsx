import {
  Box,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Select,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import {
  FootNote,
  IntroHeader,
  UserInfoLine,
  amountFormat,
  m as coreMessages,
} from '@island.is/service-portal/core'
import { useEffect, useMemo, useState } from 'react'
import { m } from '../../lib/messages'
import { useGetPreviousPaymentsQuery } from './PaymentPlan.generated'
import { PaymentGroupTable } from '../../components'

const PaymentPlan = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetPreviousPaymentsQuery()

  const yearOptions = useMemo(() => {
    const years = data?.socialInsurancePayments?.paymentYears ?? []
    return years.map((y) => ({ value: y, label: y.toString() }))
  }, [data?.socialInsurancePayments?.paymentYears])

  const [selectedYear, setSelectedYear] = useState<{
    value: number
    label: string
  }>()

  useEffect(() => {
    if (!yearOptions.length || selectedYear) {
      return
    }
    setSelectedYear(yearOptions[0])
    return
  }, [yearOptions, selectedYear])

  return (
    <Box>
      <IntroHeader
        title={formatMessage(coreMessages.socialInsuranceMaintenance)}
        intro={formatMessage(
          coreMessages.socialInsuranceMaintenanceDescription,
        )}
        serviceProviderSlug={'tryggingastofnun'}
        serviceProviderTooltip={formatMessage(
          coreMessages.socialInsuranceTooltip,
        )}
      />
      {error && !loading ? (
        <Problem error={error} noBorder={false} />
      ) : !error && !loading && !data?.socialInsurancePayments ? (
        <Problem type="no_data" noBorder={false} />
      ) : (
        <>
          <Box>
            <Stack space={1}>
              <UserInfoLine
                label={formatMessage(m.nextPayment)}
                content={
                  data?.socialInsurancePayments?.nextPayment
                    ? amountFormat(data?.socialInsurancePayments?.nextPayment)
                    : ''
                }
                loading={loading}
              />
              <Divider />
              <UserInfoLine
                label={formatMessage(m.previousMonthsPayment)}
                content={
                  data?.socialInsurancePayments?.previousPayment
                    ? amountFormat(
                        data?.socialInsurancePayments?.previousPayment,
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

            {!selectedYear && (
              <Box printHidden marginBottom={3}>
                <SkeletonLoader height={48} width={226} />
              </Box>
            )}
            {selectedYear && (
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
            )}
            <PaymentGroupTable selectedYear={selectedYear?.value} />
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

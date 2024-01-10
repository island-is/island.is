import { useLocale, useNamespaces } from '@island.is/localization'
import { useGetPaymentPlanQuery } from './PaymentPlan.generated'
import { Problem } from '@island.is/react-spa/shared'
import {
  Box,
  DatePicker,
  Inline,
  Text,
  Button,
  Table,
} from '@island.is/island-ui/core'
import {
  IntroHeader,
  UserInfoLine,
  m as coreMessages,
} from '@island.is/service-portal/core'
import { m } from '../../lib/messages'

const PaymentPlan = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetPaymentPlanQuery()

  if (error) {
    return <Problem type="internal_service_error" error={error} />
  }

  return (
    <Box>
      <IntroHeader
        title={coreMessages.socialInsuranceMaintenance}
        intro={coreMessages.socialInsuranceMaintenanceDescription}
        serviceProviderSlug={'tryggingastofnun'}
        serviceProviderTooltip="Eitthvað tooltip"
      />
      <UserInfoLine
        label={formatMessage(m.nextPayment)}
        content={
          data?.socialInsurancePaymentPlan?.nextPayment?.toString() ?? ''
        }
        loading={loading}
      />
      <UserInfoLine
        label={formatMessage(m.previousMonthsPayment)}
        content={
          data?.socialInsurancePaymentPlan?.previousPayment?.toString() ?? ''
        }
        loading={loading}
      />
      <Text variant="h5">{formatMessage(coreMessages.period)}</Text>
      <Inline space={1}>
        <DatePicker
          backgroundColor="blue"
          label={formatMessage(coreMessages.year)}
          placeholderText={undefined}
        />
        <Button icon="print" onClick={() => console.log('clicked print')}>
          {formatMessage(coreMessages.print)}
        </Button>
        <Button icon="download" onClick={() => console.log('clicked download')}>
          {formatMessage(coreMessages.getDocument)}
        </Button>
      </Inline>
      <Table.Table>
        <Table.Head>
          <Table.HeadData>{formatMessage(m.paymentTypes)}</Table.HeadData>
          <Table.HeadData>
            {formatMessage(m.yearCumulativeTotal)}
          </Table.HeadData>
        </Table.Head>
      </Table.Table>
    </Box>
  )
}

export default PaymentPlan

import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import {
  IntroWrapper,
  LinkButton,
  UserInfoLine,
  amountFormat,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { m } from '../../lib/messages'
import { PaymentGroupTable } from '../../components'
import { useGetPreviousPaymentsQuery } from './PaymentPlan.generated'

// Greiðsluáætlun
const PaymentPlan = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetPreviousPaymentsQuery()

  return (
    <Box>
      <IntroWrapper
        title={formatMessage(coreMessages.paymentPlan)}
        intro={formatMessage(
          coreMessages.socialInsuranceMaintenanceDescription,
        )}
        serviceProviderSlug={'tryggingastofnun'}
        serviceProviderTooltip={formatMessage(
          coreMessages.socialInsuranceTooltip,
        )}
        childrenWidthFull
      >
        {error && !loading ? (
          <Problem error={error} noBorder={false} />
        ) : !error && !loading && !data?.socialInsurancePayments ? (
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(coreMessages.noData)}
            message={formatMessage(coreMessages.noDataFoundDetail)}
            imgSrc="./assets/images/sofa.svg"
          />
        ) : (
          <>
            <Box>
              <Stack space={1}>
                <UserInfoLine
                  label={formatMessage(m.nextPayment)}
                  content={
                    data?.socialInsurancePayments?.nextPayment
                      ? amountFormat(data?.socialInsurancePayments?.nextPayment)
                      : ' 0 kr.'
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
                      : ' 0 kr.'
                  }
                  loading={loading}
                />
                <Divider />
              </Stack>

              <Text marginTop={[2, 2, 6]} marginBottom={2} variant="h5">
                {formatMessage(coreMessages.period)}
              </Text>

              <PaymentGroupTable />
            </Box>
            <Box>
              <Text variant="small" marginTop={5} marginBottom={2}>
                {formatMessage(m.maintenanceFooter)}{' '}
                {formatMessage(m.maintenanceFooterLink, {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  link: (str: any) => (
                    <LinkButton
                      to={formatMessage(m.maintenanceFooterLinkUrl)}
                      text={str ?? ''}
                      variant="text"
                    />
                  ),
                })}
              </Text>
              <Text variant="small" marginBottom={2}>
                {formatMessage(m.maintenanceFooterTemporaryWarning)}
              </Text>
            </Box>
          </>
        )}
      </IntroWrapper>
    </Box>
  )
}

export default PaymentPlan

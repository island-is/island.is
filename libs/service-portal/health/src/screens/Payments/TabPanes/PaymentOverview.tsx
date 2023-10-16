import {
  AlertMessage,
  Box,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import {
  useGetCopaymentPeriodsQuery,
  useGetCopaymentStatusQuery,
} from '../Payments.generated'
import { useGetMockCopaymentStatusQuery } from '../mocks/mocks'
import { UserInfoLine } from '@island.is/service-portal/core'
import { messages } from '../../../lib/messages'
import { useLocale } from '@island.is/localization'

export const PaymentOverview = () => {
  // const {
  //   data: statusData,
  //   loading: statusLoading,
  //   error: statusError,
  // } = useGetCopaymentStatusQuery()
  // const {
  //   data: periodsData,
  //   loading: periodsLoading,
  //   error: periodsError,
  // } = useGetCopaymentPeriodsQuery()

  const { data, loading, error } = useGetMockCopaymentStatusQuery()

  const { formatMessage } = useLocale()

  console.log(data, loading, error)

  const status = data?.items[0]

  return (
    <Box paddingY={4} background="white">
      {error ? (
        <AlertMessage
          type="error"
          title="Villa kom upp"
          message="Ekki tókst að sækja greiðsluupplýsingar"
        />
      ) : loading ? (
        <SkeletonLoader space={2} repeat={3} height={24} />
      ) : (
        <Box borderBottomWidth="standard" borderColor="blueberry200">
          <Stack dividers="blueberry200" space={1}>
            <UserInfoLine
              title={formatMessage(messages.statusOfRights)}
              titlePadding={2}
              label={formatMessage(messages.maximumMonthlyPayment)}
              content={formatMessage(messages.medicinePaymentPaidAmount, {
                amount: status?.maximumMonthlyPayment ?? 0,
              })}
            />
            <UserInfoLine
              label={formatMessage(messages.paymentTarget)}
              content={formatMessage(messages.medicinePaymentPaidAmount, {
                amount: status?.maximumPayment ?? 0,
              })}
            />
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default PaymentOverview

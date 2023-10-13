import {
  useGetCopaymentPeriodsQuery,
  useGetCopaymentStatusQuery,
} from '../Payments.generated'

export const PaymentOverview = () => {
  const {
    data: statusData,
    loading: statusLoading,
    error: statusError,
  } = useGetCopaymentStatusQuery()
  const {
    data: periodsData,
    loading: periodsLoading,
    error: periodsError,
  } = useGetCopaymentPeriodsQuery()

  return (
    <div>
      <h2>Payment overview</h2>
    </div>
  )
}

export default PaymentOverview

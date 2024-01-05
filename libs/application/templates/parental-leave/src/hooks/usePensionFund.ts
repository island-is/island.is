import { useQuery } from '@apollo/client'

import { GetPensionFunds } from '../graphql/queries'
import { GetPensionFundsQuery } from '../types/schema'

export const usePensionFund = () => {
  const { data: pensionFundData } =
    useQuery<GetPensionFundsQuery>(GetPensionFunds)

  return (
    pensionFundData?.getPensionFunds?.map(({ id, name }) => ({
      label: name,
      value: id,
    })) ?? []
  )
}

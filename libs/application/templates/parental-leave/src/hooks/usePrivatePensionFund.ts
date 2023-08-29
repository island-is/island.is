import { useQuery } from '@apollo/client'

import { GetPrivatePensionFunds } from '../graphql/queries'
import { GetPrivatePensionFundsQuery } from '../types/schema'

export const usePrivatePensionFund = () => {
  const { data: privatePensionFundData } =
    useQuery<GetPrivatePensionFundsQuery>(GetPrivatePensionFunds)

  return (
    privatePensionFundData?.getPrivatePensionFunds?.map(({ id, name }) => ({
      label: name,
      value: id,
    })) ?? []
  )
}

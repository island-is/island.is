import { useQuery } from '@apollo/client'

import { GetPrivatePensionFunds } from '../graphql/queries'
import { Query } from '@island.is/api/schema'

export const usePrivatePensionFund = () => {
  const { data: privatePensionFundData } = useQuery<Query>(
    GetPrivatePensionFunds,
  )

  return (
    privatePensionFundData?.getPrivatePensionFunds?.map(({ id, name }) => ({
      label: name,
      value: id,
    })) ?? []
  )
}

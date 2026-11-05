import { useQuery } from '@apollo/client'

import { GetPensionFunds } from '../graphql/queries'
import { Query } from '@island.is/api/schema'

export const usePensionFund = () => {
  const { data: pensionFundData } = useQuery<Query>(GetPensionFunds)

  return (
    pensionFundData?.getPensionFunds?.map(({ id, name }) => ({
      label: name,
      value: id,
    })) ?? []
  )
}

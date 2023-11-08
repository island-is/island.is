import { useQuery } from '@apollo/client'

import { GetCurrencies } from '../graphql/queries'
import { GetCurrenciesQuery } from '../types/schema'

export const useCurrencies = () => {
  const { data: currenciesData } = useQuery<GetCurrenciesQuery>(GetCurrencies)

  return (
    currenciesData?.getCurrencies?.map((currency) => ({
      label: currency,
      value: currency,
    })) ?? []
  )
}

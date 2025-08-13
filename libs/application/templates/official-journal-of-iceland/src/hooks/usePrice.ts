import { useQuery } from '@apollo/client'
import { GET_PRICE_QUERY } from '../graphql/queries'
import { OfficialJournalOfIcelandApplicationGetPriceResponse } from '@island.is/api/schema'

type Props = {
  applicationId: string
}

export const usePrice = ({ applicationId }: Props) => {
  const { data, loading, error } = useQuery<{
    officialJournalOfIcelandApplicationGetPrice: OfficialJournalOfIcelandApplicationGetPriceResponse
  }>(GET_PRICE_QUERY, {
    skip: !applicationId,
    fetchPolicy: 'no-cache',
    variables: {
      id: applicationId,
    },
  })

  return {
    price: data?.officialJournalOfIcelandApplicationGetPrice.price ?? 0,
    loading,
    error,
  }
}

import { useQuery } from '@apollo/client'
import { CATEGORIES_QUERY } from '../graphql/queries'
import { OfficialJournalOfIcelandAdvertsCategoryResponse } from '@island.is/api/schema'

type CategoriesResponse = {
  officialJournalOfIcelandCategories: OfficialJournalOfIcelandAdvertsCategoryResponse
}

export const useCategories = () => {
  const { data, loading, error } = useQuery<CategoriesResponse>(
    CATEGORIES_QUERY,
    {
      variables: {
        params: {
          pageSize: 1000,
        },
      },
    },
  )

  return {
    categories: data?.officialJournalOfIcelandCategories.categories,
    loading,
    error,
  }
}

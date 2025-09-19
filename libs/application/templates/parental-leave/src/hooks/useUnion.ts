import { useQuery } from '@apollo/client'

import { GetUnions } from '../graphql/queries'
import { Query } from '@island.is/api/schema'

export const useUnion = () => {
  const { data: unionData } = useQuery<Query>(GetUnions)

  return (
    unionData?.getUnions?.map(({ id, name }) => ({
      label: name,
      value: id,
    })) ?? []
  )
}

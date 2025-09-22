import { useQuery } from '@apollo/client'

import { GetUnions } from '../graphql/queries'
import { GetUnionsQuery } from '../types/schema'

export const useUnion = () => {
  const { data: unionData } = useQuery<GetUnionsQuery>(GetUnions)

  return (
    unionData?.getUnions?.map(({ id, name }) => ({
      label: name,
      value: id,
    })) ?? []
  )
}

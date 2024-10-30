import { useQuery } from '@apollo/client'
import { TYPE_QUERY } from '../graphql/queries'
import { OfficialJournalOfIcelandAdvertType } from '@island.is/api/schema'

type Props = {
  typeId?: string
}

type TypeResponse = {
  type: OfficialJournalOfIcelandAdvertType
}

export const useType = ({ typeId }: Props) => {
  const { data, loading, error } = useQuery<{
    officialJournalOfIcelandType: TypeResponse
  }>(TYPE_QUERY, {
    skip: !typeId,
    variables: {
      params: {
        id: typeId,
      },
    },
  })

  return {
    type: data?.officialJournalOfIcelandType?.type,
    loading,
    error,
  }
}

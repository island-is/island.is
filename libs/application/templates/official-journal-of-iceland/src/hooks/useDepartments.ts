import { useQuery } from '@apollo/client'
import { DEPARTMENTS_QUERY } from '../graphql/queries'
import { OfficialJournalOfIcelandAdvertsDepartmentsResponse } from '@island.is/api/schema'

type DepartmentsResponse = {
  officialJournalOfIcelandDepartments: OfficialJournalOfIcelandAdvertsDepartmentsResponse
}

type Props = {
  onCompleted?: (data: DepartmentsResponse) => void
}

export const useDepartments = ({ onCompleted }: Props = {}) => {
  const { data, loading, error } = useQuery<DepartmentsResponse>(
    DEPARTMENTS_QUERY,
    {
      variables: {
        params: {
          page: 1,
        },
      },
      onCompleted,
    },
  )

  return {
    departments: data?.officialJournalOfIcelandDepartments.departments,
    loading,
    error,
  }
}

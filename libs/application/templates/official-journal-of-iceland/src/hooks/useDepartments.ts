import { useQuery } from '@apollo/client'
import { DEPARTMENTS_QUERY } from '../graphql/queries'
import { OfficialJournalOfIcelandAdvertsDepartmentsResponse } from '@island.is/api/schema'

type DepartmentsResponse = {
  officialJournalOfIcelandDepartments: OfficialJournalOfIcelandAdvertsDepartmentsResponse
}

export const useDepartments = () => {
  const { data, loading, error } = useQuery<DepartmentsResponse>(
    DEPARTMENTS_QUERY,
    {
      variables: {
        params: {
          page: 1,
        },
      },
    },
  )

  return {
    departments: data?.officialJournalOfIcelandDepartments.departments,
    loading,
    error,
  }
}

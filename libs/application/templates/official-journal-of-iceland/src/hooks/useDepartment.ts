import { useQuery } from '@apollo/client'
import { OfficialJournalOfIcelandAdvertEntity } from '@island.is/api/schema'
import { DEPARTMENT_QUERY } from '../graphql/queries'

type Props = {
  departmentId?: string
}

type DepartmentResponse = {
  department: OfficialJournalOfIcelandAdvertEntity
}

export const useDepartment = ({ departmentId }: Props) => {
  const { data, loading, error } = useQuery<{
    officialJournalOfIcelandDepartment: DepartmentResponse
  }>(DEPARTMENT_QUERY, {
    skip: !departmentId,
    variables: {
      params: {
        id: departmentId,
      },
    },
  })

  return {
    department: data?.officialJournalOfIcelandDepartment?.department,
    loading,
    error,
  }
}

import { useQuery } from '@apollo/client'
import { ASSIGNEE_APPLICATIONS } from '../../lib/queries/assigneeApplications'

export const useAssigneeApplications = (natReg: string) => {
  const { data, loading, error } = useQuery(ASSIGNEE_APPLICATIONS, {
    variables: {
      input: {
        nationalRegistryId: natReg,
      },
    },
  })

  return {
    data: data?.getApplicationsByAssignee || null,
    loading,
    error,
  }
}

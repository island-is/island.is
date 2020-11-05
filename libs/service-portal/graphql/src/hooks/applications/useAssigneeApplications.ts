import { useQuery } from '@apollo/client'
import { ASSIGNEE_APPLICATIONS } from '../../lib/queries/assigneeApplications'

export const useAssigneeApplications = () => {
  const { data, loading, error } = useQuery(ASSIGNEE_APPLICATIONS)

  return {
    data: data?.getApplicationsByAssignee || null,
    loading,
    error,
  }
}

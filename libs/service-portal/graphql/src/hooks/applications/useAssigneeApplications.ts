import { useQuery } from '@apollo/client'
import { Query, QueryListDocumentsArgs } from '@island.is/api/schema'
import { ASSIGNEE_APPLICATIONS } from '../../lib/queries/assigneeApplications'
import { useState } from 'react'

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

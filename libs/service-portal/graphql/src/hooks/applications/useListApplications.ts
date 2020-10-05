import { useQuery } from '@apollo/client'
import { Query, QueryListDocumentsArgs } from '@island.is/api/schema'
import { LIST_APPLICATIONS } from '../../lib/queries/listApplications'
import { useState } from 'react'

export const useListApplications = (natReg: string) => {
  const { data, loading, error } = useQuery(LIST_APPLICATIONS, {
    variables: {
      input: {
        nationalRegistryId: natReg,
      },
    },
  })

  return {
    data: data?.getApplicationsByApplicant || null,
    loading,
    error,
  }
}

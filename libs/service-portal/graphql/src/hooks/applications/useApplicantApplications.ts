import { useQuery } from '@apollo/client'
import { Query, QueryListDocumentsArgs } from '@island.is/api/schema'
import { APPLICANT_APPLICATIONS } from '../../lib/queries/applicantApplications'
import { useState } from 'react'

export const useApplicantApplications = (natReg: string) => {
  const { data, loading, error } = useQuery(APPLICANT_APPLICATIONS, {
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

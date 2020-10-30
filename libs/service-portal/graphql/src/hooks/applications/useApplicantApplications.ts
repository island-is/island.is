import { useQuery } from '@apollo/client'
import { APPLICANT_APPLICATIONS } from '../../lib/queries/applicantApplications'

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

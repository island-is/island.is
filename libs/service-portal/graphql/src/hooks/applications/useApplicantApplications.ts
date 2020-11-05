import { useQuery } from '@apollo/client'
import { APPLICANT_APPLICATIONS } from '../../lib/queries/applicantApplications'

export const useApplicantApplications = () => {
  const { data, loading, error } = useQuery(APPLICANT_APPLICATIONS)

  return {
    data: data?.getApplicationsByApplicant || null,
    loading,
    error,
  }
}

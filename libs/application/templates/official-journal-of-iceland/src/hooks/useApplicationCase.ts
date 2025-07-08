import { useQuery } from '@apollo/client'
import { GET_APPLICATION_CASE_QUERY } from '../graphql/queries'

type Params = {
  applicationId: string
}

type GetApplicationCaseResponse = {
  OJOIAGetApplicationCase: {
    department: string
    type: string
    status: string
    communicationStatus: string
    categories: string[]
    html: string
    expectedPublishDate?: string
  }
}

export const useApplicationCase = ({ applicationId }: Params) => {
  const { data, loading, error } = useQuery<GetApplicationCaseResponse>(
    GET_APPLICATION_CASE_QUERY,
    {
      variables: { input: { id: applicationId } },
    },
  )

  return {
    caseData: data?.OJOIAGetApplicationCase,
    loading,
    error,
  }
}

import { useLazyQuery, useQuery } from '@apollo/client'
import { ADVERT_TEMPLATE_QUERY } from '../graphql/queries'
import {
  OfficialJournalOfIcelandApplicationAdvertTemplateResponse,
  OfficialJournalOfIcelandApplicationAdvertTemplateType,
} from '@island.is/api/schema'

type TemplatesResponse = {
  officialJournalOfIcelandApplicationAdvertTemplate: OfficialJournalOfIcelandApplicationAdvertTemplateResponse
}

export const useAdvertTemplate = (
  type: OfficialJournalOfIcelandApplicationAdvertTemplateType,
) => {
  const { data, error, loading } = useQuery<TemplatesResponse>(
    ADVERT_TEMPLATE_QUERY,
    {
      variables: {
        params: {
          type,
        },
      },
    },
  )

  return {
    templates: data?.officialJournalOfIcelandApplicationAdvertTemplate,
    error,
    loading,
  }
}

export const useAdvertTemplateLazy = (
  onSuccess: (data: TemplatesResponse) => void,
) => {
  return useLazyQuery<TemplatesResponse>(ADVERT_TEMPLATE_QUERY, {
    fetchPolicy: 'no-cache',
    onCompleted: onSuccess,
  })
}

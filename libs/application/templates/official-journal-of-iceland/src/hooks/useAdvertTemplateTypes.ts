import { useQuery } from '@apollo/client'
import { ADVERT_TEMPLATE_TYPES_QUERY } from '../graphql/queries'
import { OfficialJournalOfIcelandApplicationAdvertTemplateTypesResponse } from '@island.is/api/schema'

type TemplatesResponse = {
  officialJournalOfIcelandApplicationAdvertTemplateTypes: OfficialJournalOfIcelandApplicationAdvertTemplateTypesResponse
}

export const useAdvertTemplateTypes = () => {
  const { data, error, loading } = useQuery<TemplatesResponse>(
    ADVERT_TEMPLATE_TYPES_QUERY,
  )

  return {
    templateTypes:
      data?.officialJournalOfIcelandApplicationAdvertTemplateTypes.types,
    error,
    loading,
  }
}

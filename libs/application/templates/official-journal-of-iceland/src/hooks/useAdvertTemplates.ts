import { useQuery } from '@apollo/client'
import { ADVERT_TEMPLATES_QUERY } from '../graphql/queries'
import { OfficialJournalOfIcelandApplicationAdvertTemplatesResponse } from '@island.is/api/schema'

type TemplatesResponse = {
  officialJournalOfIcelandAdvertTemplates: OfficialJournalOfIcelandApplicationAdvertTemplatesResponse
}

export const useAdvertTemplateTypes = () => {
  const { data, error, loading } = useQuery<TemplatesResponse>(
    ADVERT_TEMPLATES_QUERY,
  )

  return {
    templateTypes: data?.officialJournalOfIcelandAdvertTemplates.templateTypes,
    error,
    loading,
  }
}

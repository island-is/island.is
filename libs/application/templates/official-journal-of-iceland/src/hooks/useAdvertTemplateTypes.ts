import { useQuery } from '@apollo/client'
import { ADVERT_TEMPLATES_QUERY } from '../graphql/queries'
import { OfficialJournalOfIcelandApplicationAdvertTemplatesResponse } from '@island.is/api/schema'

type TemplatesResponse = {
  officialJournalOfIcelandApplicationAdvertTemplates: OfficialJournalOfIcelandApplicationAdvertTemplatesResponse
}

export const useAdvertTemplateTypes = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error, loading } = useQuery<TemplatesResponse>(
    ADVERT_TEMPLATES_QUERY,
  )

  return {
    templateTypes:
      data?.officialJournalOfIcelandApplicationAdvertTemplates.templateTypes,
    error,
    loading,
  }
}

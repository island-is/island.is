import { useQuery } from '@apollo/client'
import { LAW_CHAPTERS_QUERY } from '../graphql/queries'
import type { LawChapter } from '@island.is/regulations'

type LawChaptersResponse = {
  OJOIAGetLawChapters: LawChapter[] | null
}

export const useLawChapters = () => {
  const { data, loading, error } =
    useQuery<LawChaptersResponse>(LAW_CHAPTERS_QUERY)

  return {
    lawChapters: data?.OJOIAGetLawChapters ?? [],
    loading,
    error,
  }
}

'use client'

import { useEffect } from 'react'
import { setCustomVariable, trackSiteSearch } from './tracking'

export const useMatomoTrackOrganization = (organization?: string | null) => {
  useEffect(() => {
    if (!organization) return

    setCustomVariable(1, 'organization', organization, 'visit')
  }, [organization])
}

export const useMatomoTrackSearch = (
  keyword?: string,
  category?: string | false,
  resultsCount?: number,
) => {
  useEffect(() => {
    if (!keyword) return

    trackSiteSearch(keyword, category, resultsCount)
  }, [keyword, category, resultsCount])
}

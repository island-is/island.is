import { SearchableTags } from '@island.is/web/graphql/schema'

export const getServiceWebSearchTagQuery = (institutionSlug?: string) => {
  const institutionSlugBelongsToDigitalIceland =
    !institutionSlug ||
    institutionSlug === 'stafraent-island' ||
    institutionSlug === 'digital-iceland'

  const mannaudstorgTag = [
    { key: 'mannaudstorg', type: SearchableTags.Organization },
  ]

  // Digital Iceland service web searches all Q&A content (excluding mannaudstorg)
  if (institutionSlugBelongsToDigitalIceland) {
    return {
      excludedTags: mannaudstorgTag,
    }
  }

  return {
    tags: [
      {
        type: SearchableTags.Organization,
        key: institutionSlug,
      },
    ],
  }
}

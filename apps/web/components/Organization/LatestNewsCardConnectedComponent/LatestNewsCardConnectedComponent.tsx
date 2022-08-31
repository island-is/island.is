import { useQuery } from '@apollo/client'
import { ProfileCard } from '@island.is/island-ui/core'
import { GetNewsQuery, QueryGetNewsArgs } from '@island.is/web/graphql/schema'
import { linkResolver } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { GET_NEWS_QUERY } from '@island.is/web/screens/queries'

interface LatestNewsCardConnectedComponentProps {
  organizationSlug?: string
  seeMoreText?: string
  tags?: string[]
  imageUrl?: string
}

export const LatestNewsCardConnectedComponent = ({
  organizationSlug,
  seeMoreText = 'Skoða nánar',
  tags = [],
  imageUrl,
}: LatestNewsCardConnectedComponentProps) => {
  const { activeLocale } = useI18n()

  const response = useQuery<GetNewsQuery, QueryGetNewsArgs>(GET_NEWS_QUERY, {
    variables: {
      input: {
        lang: activeLocale,
        size: 1,
        tags,
      },
    },
  })

  const data = response.data?.getNews?.items[0]

  if (!data) return null

  const url = organizationSlug
    ? linkResolver('organizationnews', [organizationSlug, data.slug]).href
    : linkResolver('news', [data.slug]).href

  return (
    <ProfileCard
      key={data.id}
      title={data.title}
      description={data.subtitle}
      link={{ text: seeMoreText, url }}
      image={imageUrl}
      size="small"
    />
  )
}

import { useEffect, useState } from 'react'
import { Box, ProfileCard, Text } from '@island.is/island-ui/core'
import initApollo from '@island.is/web/graphql/client'
import {
  GetNewsQuery,
  GetSingleNewsItemQuery,
  QueryGetNewsArgs,
  QueryGetSingleNewsArgs,
} from '@island.is/web/graphql/schema'
import { linkResolver } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import {
  GET_NEWS_QUERY,
  GET_SINGLE_NEWS_ITEM_QUERY,
} from '@island.is/web/screens/queries'
import * as styles from './LatestNewsCardConnectedComponent.css'

const extractHeadingsFromContent = (
  content: GetSingleNewsItemQuery['getSingleNews']['content'],
) => {
  if (!content) return []

  const headings: string[] = []

  let haveSeenText = false
  for (const slice of content) {
    if (slice.__typename !== 'Html') continue

    if (!haveSeenText && slice.document?.content?.[0]?.content?.[0]?.value) {
      headings.push(slice.document.content[0].content[0].value)
    } else if (
      haveSeenText &&
      slice.document?.content?.[0]?.content?.[0]?.value &&
      slice.document?.content?.[0]?.nodeType === 'heading-3'
    ) {
      headings.push(slice.document.content[0].content[0].value)
    }

    haveSeenText = true
  }

  headings.pop()

  return headings
}

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

  const [card, setCard] = useState<
    GetSingleNewsItemQuery['getSingleNews'] | null
  >(null)

  useEffect(() => {
    let isMounted = true

    const apolloClient = initApollo({}, activeLocale)

    const fetchLatestNewsItem = async () => {
      const getNewsResponse = await apolloClient.query<
        GetNewsQuery,
        QueryGetNewsArgs
      >({
        query: GET_NEWS_QUERY,
        variables: {
          input: {
            lang: activeLocale,
            size: 1,
            tags,
          },
        },
      })

      const newsItemDto = getNewsResponse?.data?.getNews?.items?.[0]

      if (!newsItemDto) {
        return null
      }

      const getSingleNewsResponse = await apolloClient.query<
        GetSingleNewsItemQuery,
        QueryGetSingleNewsArgs
      >({
        query: GET_SINGLE_NEWS_ITEM_QUERY,
        variables: {
          input: {
            slug: newsItemDto.slug,
            lang: activeLocale,
          },
        },
      })

      return getSingleNewsResponse.data.getSingleNews
    }

    fetchLatestNewsItem()
      .then((card) => {
        if (!isMounted) return
        setCard(card)
      })
      .catch((error) => {
        console.error(error)
      })

    return () => {
      isMounted = false
    }
  }, [activeLocale])

  if (!card) return null

  const url = organizationSlug
    ? linkResolver('organizationnews', [organizationSlug, card.slug]).href
    : linkResolver('news', [card.slug]).href

  const headings = extractHeadingsFromContent(card.content)

  return (
    <ProfileCard
      key={card.id}
      title={card.title}
      description={
        <Box marginX={3}>
          <ul>
            {headings.map((heading, index) => (
              <li key={index} className={styles.list}>
                <Text lineHeight="sm" variant="small">
                  {heading}
                </Text>
              </li>
            ))}
          </ul>
        </Box>
      }
      link={{ text: seeMoreText, url }}
      image={imageUrl}
      size="small"
    />
  )
}

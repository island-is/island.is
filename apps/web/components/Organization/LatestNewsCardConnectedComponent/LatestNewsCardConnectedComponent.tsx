import { useQuery } from '@apollo/client'

import { Box, ProfileCard, Text } from '@island.is/island-ui/core'
import {
  GetNewsWithContentQuery,
  GetNewsWithContentQueryVariables,
  GetSingleNewsItemQuery,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { GET_NEWS_WITH_CONTENT_QUERY } from '@island.is/web/screens/queries'

import * as styles from './LatestNewsCardConnectedComponent.css'

const extractHeadingsFromContent = (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  content: GetSingleNewsItemQuery['getSingleNews']['content'],
  count?: number,
  skipLastHeading?: boolean,
) => {
  if (!content || !count) return []

  const headings: string[] = []

  let haveSeenText = false
  for (const slice of content) {
    if (slice.__typename !== 'Html') continue

    const value = slice.document?.content?.[0]?.content?.[0]?.value
    const nodeType = slice.document?.content?.[0]?.nodeType

    if (!haveSeenText || nodeType === 'heading-3') {
      if (value) {
        headings.push(value)
        haveSeenText = true
      }
    }
  }

  // Potentially skip the last one since that's not a heading we'd like to show
  // See here: https://island.is/s/stafraent-island/frett/frettabref-juli-2022
  // The last heading is 'Meðal verkefna Stafræns Íslands þessa dagana eru:'
  if (skipLastHeading) headings.pop()

  return headings.slice(0, count)
}

interface LatestNewsCardConnectedComponentProps {
  organizationSlug?: string
  seeMoreText?: string
  tags?: string[]
  imageUrl?: string
  shouldExtractHeadingsFromContent?: boolean
  numberOfHeadingsToExtractFromContent?: number
  skipLastHeading?: boolean
}

export const LatestNewsCardConnectedComponent = ({
  organizationSlug,
  seeMoreText = 'Skoða nánar',
  tags = [],
  imageUrl,
  shouldExtractHeadingsFromContent,
  numberOfHeadingsToExtractFromContent = 4,
  skipLastHeading = true,
}: LatestNewsCardConnectedComponentProps) => {
  const { linkResolver } = useLinkResolver()
  const { activeLocale } = useI18n()

  const response = useQuery<
    GetNewsWithContentQuery,
    GetNewsWithContentQueryVariables
  >(GET_NEWS_WITH_CONTENT_QUERY, {
    variables: {
      input: {
        lang: activeLocale,
        size: 1,
        tags,
      },
    },
  })

  const card = response?.data?.getNews?.items?.[0]

  if (!card) return null

  const url = organizationSlug
    ? linkResolver('organizationnews', [organizationSlug, card.slug]).href
    : linkResolver('news', [card.slug]).href

  const headings = shouldExtractHeadingsFromContent
    ? extractHeadingsFromContent(
        card.content,
        numberOfHeadingsToExtractFromContent,
        skipLastHeading,
      )
    : []

  return (
    <ProfileCard
      key={card.id}
      title={card.title}
      description={
        <Box marginX={3}>
          <ul>
            {headings.map((heading, index) => (
              <li key={index} className={styles.list}>
                <Text variant="small">{heading}</Text>
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

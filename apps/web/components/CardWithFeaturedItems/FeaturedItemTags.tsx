import { type PropsWithChildren, useMemo } from 'react'

import { Box, Link, Tag } from '@island.is/island-ui/core'
import { Featured } from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '@island.is/web/hooks'

import * as styles from './FeaturedItemTags.css'

type FeaturedItemTagsProps = {
  featuredItems: Featured[]
  maxItems?: number
  truncate?: boolean
}

export const FeaturedItemTags = ({
  featuredItems,
  maxItems = 3,
  truncate = false,
}: FeaturedItemTagsProps) => {
  const { linkResolver } = useLinkResolver()
  const items = featuredItems.slice(0, maxItems)

  return (
    <Box
      marginY={2}
      className={`${styles.purpleTags}${
        truncate ? ` ${styles.truncatedTags}` : ''
      }`}
    >
      {items.map((item: Featured) => {
        const { thing } = item
        if (!thing?.type || !thing?.slug) {
          return null
        }
        const cardUrl = linkResolver(thing.type as LinkType, [thing.slug])
        return (
          <Box marginBottom={1} key={thing.slug}>
            <FeaturedTag item={item} cardUrl={cardUrl} />
          </Box>
        )
      })}
    </Box>
  )
}

const FeaturedTag = ({
  item,
  cardUrl,
}: {
  item: Featured
  cardUrl: { href: string; as?: string }
}) => {
  const CustomLink = useMemo(
    () =>
      function FeaturedLink({
        children,
        ...props
      }: PropsWithChildren<unknown>) {
        return (
          <Link {...props} {...cardUrl} dataTestId="featured-link">
            {children}
          </Link>
        )
      },
    [cardUrl.href, cardUrl.as],
  )

  return (
    <Tag
      {...(cardUrl.href.startsWith('/')
        ? { CustomLink }
        : { href: cardUrl.href })}
      variant="purple"
    >
      {item.title}
    </Tag>
  )
}

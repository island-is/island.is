import React from 'react'

import {
  Box,
  Button,
  GridContainer,
  Hidden,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { DigitalIcelandLatestNewsCard } from '@island.is/web/components'
import { FRONTPAGE_NEWS_TAG_SLUG } from '@island.is/web/constants'
import { useLinkResolver } from '@island.is/web/hooks'

import * as styles from './DigitalIcelandLatestNewsSlice.css'

const SeeMoreLink = ({
  slice,
  slug,
  seeMoreLinkVariant = 'organization',
}: SliceProps) => {
  const { linkResolver } = useLinkResolver()
  return (
    <LinkV2
      href={
        slice.readMoreLink?.url
          ? slice.readMoreLink.url
          : linkResolver(
              seeMoreLinkVariant === 'organization'
                ? 'organizationnewsoverview'
                : seeMoreLinkVariant === 'project'
                ? 'projectnewsoverview'
                : 'newsoverview',
              slug ? [slug] : [],
            ).href
      }
    >
      <Button as="span" unfocusable={true} variant="text" icon="arrowForward">
        {slice.readMoreText}
      </Button>
    </LinkV2>
  )
}

interface SliceProps {
  slice: {
    title: string
    news: {
      id: string
      title: string
      subtitle: string
      date: string
      slug: string
      intro?: string | null
      image?: {
        url: string
        title: string
        width: number
        height: number
      } | null
      genericTags: Array<{
        id: string
        title: string
        slug: string
      }>
    }[]
    readMoreText: string
    readMoreLink?: {
      url: string
    } | null
  }
  slug?: string
  seeMoreLinkVariant?: 'organization' | 'project' | 'frontpage'
}

export const DigitalIcelandLatestNewsSlice: React.FC<
  React.PropsWithChildren<SliceProps>
> = ({ slice, slug, seeMoreLinkVariant = 'organization' }) => {
  const { linkResolver } = useLinkResolver()
  return (
    <Box component="section" aria-labelledby="news-items-title">
      <GridContainer>
        <Stack space={4}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="spaceBetween"
            alignItems="center"
            rowGap={3}
            columnGap={3}
          >
            <Text
              id="news-items-title"
              variant="h2"
              as="h2"
              dataTestId="home-news"
            >
              {slice.title}
            </Text>
            <Hidden below="md">
              <SeeMoreLink
                slice={slice}
                slug={slug}
                seeMoreLinkVariant={seeMoreLinkVariant}
              />
            </Hidden>
          </Box>
          <Box className={styles.itemListContainer}>
            {slice.news.slice(0, 3).map((news) => (
              <DigitalIcelandLatestNewsCard
                key={news.id}
                href={
                  linkResolver(
                    seeMoreLinkVariant === 'organization'
                      ? 'organizationnews'
                      : seeMoreLinkVariant === 'project'
                      ? 'projectnews'
                      : 'news',
                    slug ? [slug, news.slug] : [news.slug],
                  ).href
                }
                date={news.date}
                description={news.intro}
                imageSrc={news.image?.url ?? ''}
                tags={news.genericTags
                  .filter((tag) => tag.slug !== FRONTPAGE_NEWS_TAG_SLUG)
                  .map((tag) => tag.title)}
                title={news.title}
              />
            ))}
          </Box>
          <Hidden above="sm">
            <Box display="flex" justifyContent="center">
              <SeeMoreLink
                slice={slice}
                slug={slug}
                seeMoreLinkVariant={seeMoreLinkVariant}
              />
            </Box>
          </Hidden>
        </Stack>
      </GridContainer>
    </Box>
  )
}

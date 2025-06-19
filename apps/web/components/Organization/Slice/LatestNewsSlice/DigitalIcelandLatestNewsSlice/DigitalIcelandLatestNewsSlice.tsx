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
import { LatestNewsSlice as LatestNewsSliceSchema } from '@island.is/web/graphql/schema'
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
                : 'projectnewsoverview',
              [slug],
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
  slice: LatestNewsSliceSchema
  slug: string
  seeMoreLinkVariant?: 'organization' | 'project'
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
                      : 'projectnews',
                    [slug, news.slug],
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

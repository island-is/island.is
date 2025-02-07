import React from 'react'

import {
  Box,
  Button,
  GridContainer,
  Hidden,
  Inline,
  LinkV2,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { BackgroundImage } from '@island.is/web/components'
import { FRONTPAGE_NEWS_TAG_ID } from '@island.is/web/constants'
import { LatestNewsSlice as LatestNewsSliceSchema } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { shortenText } from '@island.is/web/screens/IcelandicGovernmentInstitutionVacancies/IcelandicGovernmentInstitutionVacanciesList'

import * as styles from './DigitalIcelandLatestNewsSlice.css'

interface ItemProps {
  imageSrc: string
  date: string
  title: string
  description?: string | null
  tags: string[]
  href: string
}

const Item = (item: ItemProps) => {
  return (
    <LinkV2 href={item.href} className={styles.itemContainer}>
      <Box
        display="flex"
        flexDirection="column"
        flexWrap="nowrap"
        rowGap={[2, 2, 2, 5]}
        justifyContent="spaceBetween"
        height="full"
      >
        <Stack space={2}>
          <BackgroundImage
            positionX="left"
            backgroundSize="cover"
            image={{ url: item.imageSrc }}
            ratio="396:210"
            boxProps={{
              alignItems: 'center',
              width: 'full',
              display: 'inlineFlex',
              overflow: 'hidden',
              borderRadius: 'large',
            }}
          />

          <Stack space={1}>
            <Text variant="h3">{item.title}</Text>
            <Text variant="medium">
              {shortenText(item.description ?? '', 80)}
            </Text>
          </Stack>
        </Stack>
        <Box>
          <Inline space={1}>
            {item.tags.map((tag) => (
              <Tag key={tag} disabled>
                {tag}
              </Tag>
            ))}
          </Inline>
        </Box>
      </Box>
    </LinkV2>
  )
}

const SeeMoreLink = ({ slice, slug }: SliceProps) => {
  const { linkResolver } = useLinkResolver()
  return (
    <LinkV2
      href={
        slice.readMoreLink?.url
          ? slice.readMoreLink.url
          : linkResolver('organizationnewsoverview', [slug]).href
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
}

export const DigitalIcelandLatestNewsSlice: React.FC<
  React.PropsWithChildren<SliceProps>
> = ({ slice, slug }) => {
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
              <SeeMoreLink slice={slice} slug={slug} />
            </Hidden>
          </Box>
          <Box className={styles.itemListContainer}>
            {slice.news.slice(0, 3).map((news) => (
              <Item
                key={news.id}
                href={linkResolver('organizationnews', [slug, news.slug]).href}
                date={news.date}
                description={news.intro}
                imageSrc={news.image?.url ?? ''}
                tags={news.genericTags
                  .filter((tag) => tag.slug !== FRONTPAGE_NEWS_TAG_ID)
                  .map((tag) => tag.title)}
                title={news.title}
              />
            ))}
          </Box>
          <Hidden above="sm">
            <Box display="flex" justifyContent="center">
              <SeeMoreLink slice={slice} slug={slug} />
            </Box>
          </Hidden>
        </Stack>
      </GridContainer>
    </Box>
  )
}

import React from 'react'

import {
  Box,
  Button,
  GridContainer,
  Inline,
  LinkV2,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { GridItems } from '@island.is/web/components'
import { LatestNewsSlice as LatestNewsSliceSchema } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'

import * as styles from './DigitalIcelandLatestNewsSlice.css'

interface ItemProps {
  imageSrc?: string
  date: string
  title: string
  description?: string | null
  tags: string[]
  href: string
}

const Item = (item: ItemProps) => {
  return (
    <LinkV2 href={item.href}>
      <Stack space={2}>
        <Box
          className={styles.imageBox}
          style={{
            background: `url("${item.imageSrc}?w=500") 50% / cover no-repeat`,
          }}
        />
        <Text variant="h3">{item.title}</Text>
        <Text variant="medium">{item.description}</Text>
        <Box>
          <Inline space={1}>
            {item.tags.map((tag) => (
              <Tag key={tag} disabled>
                {tag}
              </Tag>
            ))}
          </Inline>
        </Box>
      </Stack>
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
    <Stack space={4}>
      <GridContainer>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="spaceBetween"
          alignItems="center"
          rowGap={3}
          columnGap={3}
        >
          <Text variant="h2" as="h2" dataTestId="home-news">
            {slice.title}
          </Text>

          <LinkV2
            href={
              slice.readMoreLink?.url
                ? slice.readMoreLink.url
                : linkResolver('organizationnewsoverview', [slug]).href
            }
          >
            <Button variant="text" icon="arrowForward" nowrap>
              {slice.readMoreText}
            </Button>
          </LinkV2>
        </Box>
      </GridContainer>
      <GridItems
        third
        insideGridContainer
        mobileItemsRows={1}
        mobileItemWidth={396}
        paddingTop={5}
        paddingBottom={5}
      >
        {slice.news.slice(0, 3).map((news) => (
          <Box key={news.id} height="full">
            <Item
              href={linkResolver('organizationnews', [slug, news.slug]).href}
              date={news.date}
              description={news.intro}
              imageSrc={news.image?.url}
              tags={news.genericTags.map((tag) => tag.title)}
              title={news.title}
            />
          </Box>
        ))}
      </GridItems>
    </Stack>
  )
}

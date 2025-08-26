import React from 'react'

import {
  Box,
  Button,
  CategoryCard,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { BorderAbove } from '@island.is/web/components'
import { SLICE_SPACING } from '@island.is/web/constants'
import {
  type OverviewLinks,
  OverviewLinksLinkDataVariant,
} from '@island.is/web/graphql/schema'

import { IntroLinkImageComponent } from '../IntroLinkImageComponent/IntroLinkImageComponent'

interface SliceProps {
  slice: OverviewLinks
}

interface CardViewProps {
  slice: OverviewLinks
}

const CardView = ({ slice }: CardViewProps) => {
  return (
    <Stack space={3}>
      <GridRow rowGap={3}>
        {(slice.linkData?.categoryCardItems ?? [])
          .filter((item) => item.href && item.title)
          .map((item, index) => (
            <GridColumn key={index} span={['1/1', '1/1', '1/1', '1/1', '1/2']}>
              <CategoryCard
                heading={item.title}
                text={item.description}
                href={item.href}
              />
            </GridColumn>
          ))}
      </GridRow>
      {slice.link?.url && slice.link?.text && (
        <Box textAlign="right">
          <Link href={slice.link.url} skipTab>
            <Button
              icon="arrowForward"
              iconType="filled"
              type="button"
              variant="text"
            >
              {slice.link.text}
            </Button>
          </Link>
        </Box>
      )}
    </Stack>
  )
}

interface ImageViewProps {
  slice: OverviewLinks
}

const ImageView = ({ slice }: ImageViewProps) => {
  return (
    <Stack space={SLICE_SPACING}>
      {slice.overviewLinks.map((item, index) => (
        <IntroLinkImageComponent key={index} item={item} id={slice.id} />
      ))}
    </Stack>
  )
}

export const OverviewLinksSlice: React.FC<
  React.PropsWithChildren<SliceProps>
> = ({ slice }) => {
  const cardView =
    slice.linkData?.variant === OverviewLinksLinkDataVariant.CategoryCard

  return (
    <section
      key={slice.id}
      id={slice.id}
      aria-labelledby={'sliceTitle-' + slice.id}
    >
      <GridContainer>
        {slice.hasBorderAbove && <BorderAbove />}
        <Stack space={3}>
          {Boolean(slice.titleAbove) && cardView && (
            <Text variant="h3">{slice.titleAbove}</Text>
          )}
          {cardView && <CardView slice={slice} />}
          {!cardView && <ImageView slice={slice} />}
        </Stack>
      </GridContainer>
    </section>
  )
}

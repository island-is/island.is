import React from 'react'

import type { SliceType } from '@island.is/island-ui/contentful'
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
import type {
  IntroLinkImage,
  OverviewLinks,
  OverviewLinksCardLink,
} from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { webRichText } from '@island.is/web/utils/richText'

interface SliceProps {
  slice: OverviewLinks
}

interface IntroLinkImageComponentProps {
  item: IntroLinkImage
  slice: OverviewLinks
}

const IntroLinkImageComponent = ({
  item: { leftImage, linkTitle, image, openLinkInNewTab, title, intro, link },
  slice,
}: IntroLinkImageComponentProps) => {
  const { linkResolver } = useLinkResolver()
  return (
    <GridRow direction={leftImage ? 'row' : 'rowReverse'}>
      {image?.url && (
        <GridColumn span={['8/8', '3/8', '4/8', '3/8']}>
          <Box
            width="full"
            position="relative"
            paddingLeft={leftImage ? undefined : [0, 0, 0, 0, 6]}
            paddingRight={leftImage ? [10, 0, 0, 0, 6] : [10, 0]}
          >
            <img src={`${image.url}?w=774&fm=webp&q=80`} alt="" />
          </Box>
        </GridColumn>
      )}
      <GridColumn span={['8/8', '5/8', '4/8', '5/8']}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          height="full"
        >
          <Box>
            <Text
              as="h2"
              variant="h2"
              marginBottom={2}
              id={'sliceTitle-' + slice.id}
            >
              {title}
            </Text>
            {Boolean(intro) && (
              <Box marginBottom={4}>
                {webRichText(
                  [
                    {
                      __typename: 'Html',
                      id: intro?.id,
                      document: intro?.document,
                    },
                  ] as SliceType[],
                  undefined,
                )}
              </Box>
            )}
            {link?.slug && link?.type && (
              <Link
                {...linkResolver(link.type as LinkType, [link.slug])}
                skipTab
                newTab={openLinkInNewTab ?? true}
              >
                <Button icon="arrowForward" variant="text">
                  {linkTitle}
                </Button>
              </Link>
            )}
          </Box>
        </Box>
      </GridColumn>
    </GridRow>
  )
}

interface OneColumnTextComponentProps {
  item: OverviewLinksCardLink
}

const OneColumnTextComponent = ({ item }: OneColumnTextComponentProps) => {
  return (
    <CategoryCard
      heading={item.title}
      text={item.contentString ?? ''}
      href={item.link?.url as string}
    />
  )
}

interface CardViewProps {
  slice: OverviewLinks
}

const CardView = ({ slice }: CardViewProps) => {
  return (
    <Stack space={3}>
      {(slice.cardLinks ?? [])
        .filter((item) => item.link?.url && item.link.text)
        .map((item, index) => (
          <OneColumnTextComponent key={index} item={item} />
        ))}
      {slice.link?.url && slice.link?.text && (
        <Box textAlign="right">
          <Link href={slice.link.url}>
            <Button
              icon="arrowForward"
              iconType="filled"
              type="button"
              variant="text"
              unfocusable={true}
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
        <IntroLinkImageComponent key={index} item={item} slice={slice} />
      ))}
    </Stack>
  )
}

export const OverviewLinksSlice: React.FC<
  React.PropsWithChildren<SliceProps>
> = ({ slice }) => {
  const cardView = slice.overviewLinks.length > (slice.cardLinks?.length ?? 0)

  return (
    <section
      key={slice.id}
      id={slice.id}
      aria-labelledby={'sliceTitle-' + slice.id}
    >
      <GridContainer>
        {slice.hasBorderAbove && <BorderAbove />}
        {cardView && <CardView slice={slice} />}
        {!cardView && <ImageView slice={slice} />}
      </GridContainer>
    </section>
  )
}

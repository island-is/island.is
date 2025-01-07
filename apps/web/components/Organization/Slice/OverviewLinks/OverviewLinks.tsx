import React from 'react'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { BorderAbove } from '@island.is/web/components'
import { SLICE_SPACING } from '@island.is/web/constants'
import { OverviewLinks } from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { webRichText } from '@island.is/web/utils/richText'

interface SliceProps {
  slice: OverviewLinks
}

export const OverviewLinksSlice: React.FC<
  React.PropsWithChildren<SliceProps>
> = ({ slice }) => {
  const { linkResolver } = useLinkResolver()

  return (
    <section
      key={slice.id}
      id={slice.id}
      aria-labelledby={'sliceTitle-' + slice.id}
    >
      <GridContainer>
        {slice.hasBorderAbove && <BorderAbove />}
        <Box>
          <Stack space={SLICE_SPACING}>
            {slice.overviewLinks.map(
              (
                {
                  title,
                  linkTitle,
                  link,
                  image,
                  leftImage,
                  intro,
                  openLinkInNewTab,
                },
                index,
              ) => {
                return (
                  <GridRow
                    key={index}
                    direction={leftImage ? 'row' : 'rowReverse'}
                  >
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
                              )}{' '}
                            </Box>
                          )}
                          {link?.slug && link?.type && (
                            <Link
                              {...linkResolver(link.type as LinkType, [
                                link.slug,
                              ])}
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
              },
            )}
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
        </Box>
      </GridContainer>
    </section>
  )
}

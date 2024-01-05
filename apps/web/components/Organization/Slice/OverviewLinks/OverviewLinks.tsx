import React from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
  Link,
  BoxProps,
} from '@island.is/island-ui/core'
import { OverviewLinks } from '@island.is/web/graphql/schema'
import { Image, SliceType } from '@island.is/island-ui/contentful'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { webRichText } from '@island.is/web/utils/richText'

interface SliceProps {
  slice: OverviewLinks
}

export const OverviewLinksSlice: React.FC<
  React.PropsWithChildren<SliceProps>
> = ({ slice }) => {
  const { linkResolver } = useLinkResolver()

  const boxProps: BoxProps = slice.hasBorderAbove
    ? {
        borderTopWidth: 'standard',
        borderColor: 'standard',
        paddingTop: 4,
      }
    : {
        paddingTop: 2,
      }

  return (
    <section
      key={slice.id}
      id={slice.id}
      aria-labelledby={'sliceTitle-' + slice.id}
    >
      <GridContainer>
        <Box {...boxProps}>
          <Stack space={6}>
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
                    <GridColumn span={['8/8', '3/8', '4/8', '3/8']}>
                      <Box
                        width="full"
                        position="relative"
                        paddingLeft={leftImage ? undefined : [0, 0, 0, 0, 6]}
                        paddingRight={leftImage ? [10, 0, 0, 0, 6] : [10, 0]}
                      >
                        {/** 
                         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                         // @ts-ignore make web strict */}
                        <Image
                          url={image?.url + '?w=774&fm=webp&q=80'}
                          thumbnail={image?.url + '?w=50&fm=webp&q=80'}
                          {...image}
                        />
                      </Box>
                    </GridColumn>
                    <GridColumn span={['8/8', '5/8', '4/8', '5/8']}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        height="full"
                      >
                        <Box>
                          <Text as="h2" variant="h2" marginBottom={2}>
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
          </Stack>
          {slice.link && (
            <Link href="#">
              <Button
                icon="arrowForward"
                iconType="filled"
                type="button"
                variant="text"
              >
                {slice.link.text}
              </Button>
            </Link>
          )}
        </Box>
      </GridContainer>
    </section>
  )
}

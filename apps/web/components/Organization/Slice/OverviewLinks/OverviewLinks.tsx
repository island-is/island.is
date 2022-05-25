import React from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Stack,
  Text,
  Link,
} from '@island.is/island-ui/core'
import { GridContainer } from '@island.is/web/components'
import { OverviewLinks } from '@island.is/web/graphql/schema'
import { Image, richText, SliceType } from '@island.is/island-ui/contentful'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

interface SliceProps {
  slice: OverviewLinks
}

export const OverviewLinksSlice: React.FC<SliceProps> = ({ slice }) => {
  const { linkResolver } = useLinkResolver()

  return (
    <section key={slice.id} aria-labelledby={'sliceTitle-' + slice.id}>
      <GridContainer>
        <Box
          borderTopWidth="standard"
          borderColor="standard"
          paddingTop={[4, 4, 6]}
          paddingBottom={[4, 5, 10]}
        >
          <Stack space={6}>
            {slice.overviewLinks.map(
              ({ title, linkTitle, link, image, leftImage, intro }, index) => {
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
                        <Image
                          url={image.url + '?w=774&fm=webp&q=80'}
                          thumbnail={image.url + '?w=50&fm=webp&q=80'}
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
                              {richText(
                                [
                                  {
                                    __typename: 'Html',
                                    id: intro.id,
                                    document: intro.document,
                                  },
                                ] as SliceType[],
                                undefined,
                              )}{' '}
                            </Box>
                          )}
                          <Link
                            {...linkResolver(link.type as LinkType, [
                              link.slug,
                            ])}
                            skipTab
                            newTab={true}
                          >
                            <Button icon="arrowForward" variant="text">
                              {linkTitle}
                            </Button>
                          </Link>
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

import React from 'react'
import { Box, Button, Hidden, Link, Tag, Text } from '@island.is/island-ui/core'
import * as styles from './CardWithFeaturedItems.css'
import { GetFrontpageQuery } from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '@island.is/web/hooks'

type CardWithFeaturedItemsProps = {
  heading: string
  imgSrc: string
  alt: string
  href?: string | null
  dataTestId?: string
  seeMoreText: string
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  featuredItems: GetFrontpageQuery['getFrontpage']['lifeEvents'][0]['featured']
}

export const CardWithFeaturedItems = ({
  heading,
  imgSrc,
  alt,
  dataTestId,
  featuredItems,
  seeMoreText = 'Skoða lífsviðburð',
}: CardWithFeaturedItemsProps) => {
  const { linkResolver } = useLinkResolver()
  return (
    <Box
      background="purple100"
      borderRadius="large"
      color="purple"
      data-testid={dataTestId}
      className={styles.container}
      padding={3}
    >
      <Box
        display="flex"
        flexDirection={['columnReverse', 'row']}
        justifyContent="spaceBetween"
      >
        <Box>
          <Text variant="h3" color="purple600" truncate marginBottom={1}>
            {heading}
          </Text>
          {featuredItems.length > 0 && (
            <Hidden below="sm">
              <Box marginY={2}>
                {featuredItems.map(
                  (
                    item: {
                      title: string
                      thing: { slug: string; type: string }
                    },
                    index: number,
                  ) => {
                    const cardUrl = linkResolver(item.thing?.type as LinkType, [
                      item.thing?.slug ?? '',
                    ])
                    return (
                      <Box marginBottom={1} key={index}>
                        <Tag
                          key={item.title}
                          {...(cardUrl.href.startsWith('/')
                            ? {
                                CustomLink: ({ children, ...props }) => (
                                  <Link
                                    key={item.title}
                                    {...props}
                                    {...cardUrl}
                                    dataTestId="featured-link"
                                  >
                                    {children}
                                  </Link>
                                ),
                              }
                            : { href: cardUrl.href })}
                          variant="purple"
                          whiteBackground
                        >
                          {item.title}
                        </Tag>
                      </Box>
                    )
                  },
                )}
              </Box>
            </Hidden>
          )}
          <Button
            variant="text"
            as="span"
            icon="arrowForward"
            size="small"
            colorScheme="purple"
            nowrap
          >
            {seeMoreText !== '' ? seeMoreText : 'Skoða lífsviðburð'}
          </Button>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          marginTop={1}
          marginBottom={2}
        >
          <img src={imgSrc} alt={alt} className={styles.icon} />
        </Box>
      </Box>
    </Box>
  )
}

export default CardWithFeaturedItems

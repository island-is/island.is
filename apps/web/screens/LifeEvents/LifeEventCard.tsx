import { type PropsWithChildren, useMemo } from 'react'

import { Box, Button, Link, Tag, Text } from '@island.is/island-ui/core'
import { Featured } from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '@island.is/web/hooks'

import * as styles from './LifeEventCard.css'

const FeaturedTag = ({
  item,
  cardUrl,
}: {
  item: Featured
  cardUrl: { href: string; as?: string }
}) => {
  const CustomLink = useMemo(
    () =>
      function FeaturedLink({ children, ...props }: PropsWithChildren<unknown>) {
        return (
          <Link {...props} {...cardUrl} dataTestId="featured-link">
            {children}
          </Link>
        )
      },
    [cardUrl.href, cardUrl.as],
  )

  return (
    <Tag
      {...(cardUrl.href.startsWith('/')
        ? { CustomLink }
        : { href: cardUrl.href })}
      variant="purple"
    >
      {item.title}
    </Tag>
  )
}

type LifeEventCardProps = {
  heading: string
  imgSrc?: string
  imgAlt?: string
  href: string | null
  dataTestId?: string
  buttonTitle?: string
  featuredItems: Featured[]
}

export const LifeEventCard = ({
  heading,
  imgSrc,
  imgAlt = '',
  href,
  dataTestId,
  featuredItems,
  buttonTitle,
}: LifeEventCardProps) => {
  const { linkResolver } = useLinkResolver()
  const limitedFeaturedItems = featuredItems.slice(0, 3)

  return (
    <Box
      background="white"
      borderRadius="large"
      color="purple"
      data-testid={dataTestId}
      className={styles.container}
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      padding={3}
    >
      <Text variant="h3" color="purple600" truncate>
        {heading}
      </Text>
      <Box display="flex" flexDirection="row" style={{ height: 140 }}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flexEnd"
          style={{ flex: 1, minWidth: 0 }}
        >
          {limitedFeaturedItems.length > 0 && (
            <Box marginY={2} className={styles.purpleTags}>
              {limitedFeaturedItems.map((item: Featured) => {
                const cardUrl = linkResolver(item.thing?.type as LinkType, [
                  item.thing?.slug ?? '',
                ])
                return (
                  <Box marginBottom={1} key={item.title}>
                    <FeaturedTag item={item} cardUrl={cardUrl} />
                  </Box>
                )
              })}
            </Box>
          )}
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ flex: 1 }}
        >
          {imgSrc && (
            <img src={imgSrc} alt={imgAlt} className={styles.image} />
          )}
        </Box>
      </Box>
      {href ? (
        <Link href={href} skipTab>
          <Button
            variant="text"
            as="span"
            icon="arrowForward"
            size="small"
            colorScheme="purple"
            nowrap
          >
            {buttonTitle || ''}
          </Button>
        </Link>
      ) : (
        <Button
          variant="text"
          as="span"
          size="small"
          colorScheme="purple"
          nowrap
          disabled
        >
          {buttonTitle || ''}
        </Button>
      )}
    </Box>
  )
}

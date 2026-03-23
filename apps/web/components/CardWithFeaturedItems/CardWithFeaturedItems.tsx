import React from 'react'

import { Box, Button, Hidden, Link, Text } from '@island.is/island-ui/core'
import { Featured } from '@island.is/web/graphql/schema'

import * as styles from './CardWithFeaturedItems.css'
import { FeaturedItemTags } from './FeaturedItemTags'

type CardWithFeaturedItemsProps = {
  heading: string
  imgSrc: string
  imgAlt?: string
  href: string | null
  dataTestId?: string
  buttonTitle?: string
  featuredItems: Featured[]
  white?: boolean
}

export const CardWithFeaturedItems = ({
  heading,
  imgSrc,
  imgAlt = '',
  href,
  dataTestId,
  featuredItems,
  buttonTitle,
  white,
}: CardWithFeaturedItemsProps) => {
  const limitedFeaturedItems = featuredItems.slice(0, 3)

  return (
    <Box
      background={white ? 'white' : 'purple100'}
      borderRadius="large"
      color="purple"
      data-testid={dataTestId}
      className={styles.container}
      justifyContent="spaceBetween"
      padding={3}
      flexDirection={['columnReverse', 'row']}
      display="flex"
    >
      <Box display="flex" flexDirection="column" justifyContent="spaceBetween">
        <Box>
          <Text variant="h3" color="purple600" truncate marginBottom={[1, 0]}>
            {heading}
          </Text>
        </Box>
        <Box height="full">
          {limitedFeaturedItems.length > 0 && (
            <Hidden below="sm">
              <FeaturedItemTags featuredItems={limitedFeaturedItems} />
            </Hidden>
          )}
        </Box>
        <Link href={href ?? ''} skipTab>
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
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <img src={imgSrc} alt={imgAlt} className={styles.image} />
      </Box>
    </Box>
  )
}

export default CardWithFeaturedItems

import { Box, Button, Link, Text } from '@island.is/island-ui/core'
import { FeaturedItemTags } from '@island.is/web/components/CardWithFeaturedItems/FeaturedItemTags'
import { Featured } from '@island.is/web/graphql/schema'

import * as styles from './LifeEventCard.css'

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
            <FeaturedItemTags featuredItems={limitedFeaturedItems} truncate />
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

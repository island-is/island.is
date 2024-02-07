import React from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import * as styles from './CardWithImageAndTitle.css'

type CardWithImageAndTitleProps = {
  heading: string
  imgSrc: string
  alt: string
  href?: string | null
  dataTestId?: string
}

export const CardWithImageAndTitle = ({
  heading,
  imgSrc,
  alt,
  dataTestId,
}: CardWithImageAndTitleProps) => {
  return (
    <Box
      background="purple100"
      borderRadius="large"
      color="purple"
      data-testid={dataTestId}
      className={styles.container}
      padding={3}
      display="flex"
      justifyContent="spaceBetween"
    >
      <Box>
        <Text variant="h4" color="purple600" truncate>
          {heading}
        </Text>
        <Box marginTop={1}>
          <Button
            variant="text"
            as="span"
            icon="arrowForward"
            size="small"
            colorScheme="purple"
            nowrap
          >
            {'Skoða lífsviðburð'}
          </Button>
        </Box>
      </Box>
      <Box marginRight={[0, 2]}>
        <img src={imgSrc} alt={alt} className={styles.icon} />
      </Box>
    </Box>
  )
}

export default CardWithImageAndTitle

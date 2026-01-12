import React from 'react'

import { Box, FocusableBox, Hyphen, Text } from '@island.is/island-ui/core'

import * as styles from './IconTitleCard.css'

type IconTitleCardProps = {
  heading: string
  imgSrc: string
  alt: string
  href?: string | null
  dataTestId?: string
}

export const IconTitleCard = ({
  heading,
  imgSrc,
  alt,
  href,
  dataTestId,
}: IconTitleCardProps) => (
  <FocusableBox
    href={href ?? undefined}
    display="flex"
    justifyContent={'flexStart'}
    flexDirection={'row'}
    alignItems="center"
    background="purple100"
    borderColor="purple100"
    borderRadius="large"
    borderWidth="standard"
    height="full"
    className={styles.container}
    color="purple"
    data-testid={dataTestId}
  >
    <span className={styles.iconContainer}>
      <img src={imgSrc} alt={alt} className={styles.icon} />
    </span>
    <Box display="flex" flexDirection="column" justifyContent="spaceBetween">
      <Box paddingRight={1}>
        <Text variant="h5" color="purple600">
          <Hyphen>{heading}</Hyphen>
        </Text>
      </Box>
    </Box>
  </FocusableBox>
)

export default IconTitleCard

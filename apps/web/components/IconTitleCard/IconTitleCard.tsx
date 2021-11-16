import React from 'react'
import { FocusableBox, Text } from '@island.is/island-ui/core'

import * as styles from './IconTitleCard.css'

type IconTitleCardProps = {
  heading: string
  src: string
  alt: string
  href?: string
}

export const IconTitleCard = ({
  heading,
  href = '/',
  src = '#',
  alt = '',
}: IconTitleCardProps) => (
  <FocusableBox
    href={href}
    display="flex"
    flexDirection="row"
    alignItems="center"
    background="purple100"
    borderColor="purple100"
    borderRadius="large"
    borderWidth="standard"
    height="full"
    className={styles.container}
    color="purple"
  >
    <span className={styles.iconContainer}>
      <img src={src} alt={alt} className={styles.icon} />
    </span>
    <span className={styles.titleContainer}>
      <Text variant="h5" color="purple600" truncate>
        {heading}
      </Text>
    </span>
  </FocusableBox>
)

export default IconTitleCard

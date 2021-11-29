import React from 'react'
import { FocusableBox, Text } from '@island.is/island-ui/core'

import * as styles from './IconTitleCard.css'

type IconTitleCardProps = {
  heading: string
  imgSrc: string
  alt: string
  href: string
}

export const IconTitleCard = ({
  heading,
  imgSrc,
  alt,
  href,
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
      <img src={imgSrc} alt={alt} className={styles.icon} />
    </span>
    <span className={styles.titleContainer}>
      <Text variant="h5" color="purple600" truncate>
        {heading}
      </Text>
    </span>
  </FocusableBox>
)

export default IconTitleCard

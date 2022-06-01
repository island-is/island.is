import React from 'react'
import { FocusableBox, Text } from '@island.is/island-ui/core'

import * as styles from './IconTitleCard.css'

type IconTitleCardProps = {
  heading: string
  imgSrc: string
  alt: string
  href: string
  dataCy?: string
}

export const IconTitleCard = ({
  heading,
  imgSrc,
  alt,
  href,
  dataCy,
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
    <span className={styles.iconContainer} data-cy={dataCy}>
      <img src={imgSrc} alt={alt} className={styles.icon} />
    </span>
    <div className={styles.titleContainer}>
      <Text variant="h5" color="purple600" truncate>
        {heading}
      </Text>
    </div>
  </FocusableBox>
)

export default IconTitleCard

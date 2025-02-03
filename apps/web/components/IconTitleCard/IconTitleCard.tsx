import React from 'react'

import {
  Box,
  Button,
  FocusableBox,
  Link,
  Text,
} from '@island.is/island-ui/core'

import * as styles from './IconTitleCard.css'

type IconTitleCardProps = {
  heading: string
  imgSrc: string
  alt: string
  href?: string | null
  dataTestId?: string
  reverseOrder?: boolean
  withButton?: boolean
  buttonTitle?: string
}

export const IconTitleCard = ({
  heading,
  imgSrc,
  alt,
  href,
  dataTestId,
  reverseOrder = false,
  withButton = false,
  buttonTitle,
}: IconTitleCardProps) => (
  <FocusableBox
    href={href ?? undefined}
    display="flex"
    justifyContent={reverseOrder ? 'spaceBetween' : 'flexStart'}
    flexDirection={reverseOrder ? 'rowReverse' : 'row'}
    padding={reverseOrder ? 3 : 0}
    alignItems="center"
    background="purple100"
    borderColor="purple100"
    borderRadius="large"
    borderWidth="standard"
    height="full"
    className={withButton ? styles.containerBig : styles.container}
    color="purple"
    data-testid={dataTestId}
  >
    <span
      className={withButton ? styles.iconContainerBig : styles.iconContainer}
    >
      <img
        src={imgSrc}
        alt={alt}
        className={withButton ? styles.iconBig : styles.icon}
      />
    </span>
    <Box display="flex" flexDirection="column" justifyContent="spaceBetween">
      <div className={styles.titleContainer}>
        <Text
          variant={withButton ? 'h4' : 'h5'}
          color="purple600"
          whiteSpace="normal"
        >
          {heading}
        </Text>
      </div>
      {withButton && (
        <Box marginTop={1}>
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
        </Box>
      )}
    </Box>
  </FocusableBox>
)

export default IconTitleCard

import React, { ReactNode } from 'react'
import { Colors } from '@island.is/island-ui/theme'
import { TestSupport } from '@island.is/island-ui/utils'

import { Box, Icon, Tag, Text } from '../..'
import { Icon as IconType } from '../IconRC/iconMap'

import * as styles from './ProblemTemplate.css'

type Variant = 'info' | 'error' | 'warning'

export type ProblemTemplateBaseProps = {
  variant: Variant
  title: string
  message: string | ReactNode
  imgSrc?: string
  imgAlt?: string
  noBorder?: boolean
  titleSize?: 'h1' | 'h2'
  /**
   * If true, the out most container will be expanded to fill the available space.
   */
  expand?: boolean
} & TestSupport

interface WithIconProps extends ProblemTemplateBaseProps {
  showIcon?: boolean
  tag?: never
}

interface WithTagProps extends ProblemTemplateBaseProps {
  tag?: string
  showIcon?: never
}

export type ProblemTemplateProps = WithIconProps | WithTagProps

const getIconProps = (icon: Variant): { color: Colors; icon: IconType } => {
  switch (icon) {
    case 'error':
      return {
        color: 'red400',
        icon: 'warning',
      }
    case 'info':
      return {
        color: 'blue400',
        icon: 'informationCircle',
      }

    case 'warning':
      return {
        color: 'yellow400',
        icon: 'warning',
      }
  }
}

const variantToColour = (variant: Variant) => {
  switch (variant) {
    case 'error':
      return 'red'
    case 'info':
      return 'blue'
    case 'warning':
      return 'yellow'
  }
}

export const ProblemTemplate = ({
  tag,
  variant,
  title,
  message,
  imgSrc,
  imgAlt = '',
  noBorder,
  showIcon,
  dataTestId,
  expand,
  titleSize = 'h1',
}: ProblemTemplateProps) => {
  const convertedVariant = variantToColour(variant)
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      rowGap={2}
      className={styles.problemTemplateContainer(
        noBorder
          ? {
              noBorder: true,
            }
          : {
              [convertedVariant]: true,
            },
      )}
      paddingY={[5, 10]}
      paddingX={[3, 3, 5]}
      textAlign="center"
      dataTestId={dataTestId}
      {...(expand && {
        width: 'full',
        height: 'full',
        justifyContent: 'center',
      })}
    >
      {tag && (
        <Tag variant={convertedVariant} disabled>
          {tag}
        </Tag>
      )}
      {showIcon && (
        <Box display="flex">
          <Icon size="large" type="filled" {...getIconProps(variant)} />
        </Box>
      )}
      <Text variant={titleSize} as={titleSize} color="dark400">
        {title}
      </Text>
      <Text whiteSpace="preLine">{message}</Text>
      {imgSrc && (
        <Box marginTop={[2, 4]}>
          <img
            src={imgSrc}
            alt={imgAlt}
            className={styles.problemTemplateImg}
          />
        </Box>
      )}
    </Box>
  )
}

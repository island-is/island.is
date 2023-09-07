import { Colors } from '@island.is/island-ui/theme'
import { Box, Button, Icon, Tag, Text } from '../..'
import { Icon as IconType } from '../IconRC/iconMap'

import * as styles from './ProblemTemplate.css'

type Variant = 'info' | 'error' | 'warning'

export type ProblemTemplateBaseProps = {
  variant: Variant
  title: string
  message: string
  imgSrc?: string
  imgAlt?: string
  noBorder?: boolean
  buttonLink?: {
    text: string
    onClick(): void
  }
}

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

const getVariant = (variant: Variant) => {
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
  buttonLink,
  showIcon,
}: ProblemTemplateProps) => {
  const convertedVariant = getVariant(variant)
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      rowGap={2}
      className={styles.container(
        noBorder
          ? {
              noBorder: true,
            }
          : {
              [convertedVariant]: true,
            },
      )}
      paddingY={[5, 10]}
      paddingX={3}
      textAlign="center"
    >
      {tag && (
        <div>
          <Tag variant={convertedVariant} disabled>
            {tag}
          </Tag>
        </div>
      )}
      {showIcon && (
        <Box display="flex">
          <Icon size="large" type="filled" {...getIconProps(variant)} />
        </Box>
      )}
      <Text variant="h2" as="h2" color="dark400">
        {title}
      </Text>
      <Text whiteSpace="preLine">{message}</Text>
      {buttonLink && (
        <Button variant="ghost" onClick={buttonLink.onClick}>
          {buttonLink.text}
        </Button>
      )}
      {imgSrc && (
        <Box marginTop={[2, 8]}>
          <img src={imgSrc} alt={imgAlt} className={styles.img} />
        </Box>
      )}
    </Box>
  )
}

import React, { FC } from 'react'
import { Box } from '../Box/Box'
import { Button } from '../Button/Button'
import { Link } from '../Link/Link'
import { Icon } from '../IconRC/Icon'
import { Typography } from '../Typography/Typography'
import { Text } from '../Text/Text'
import * as styles from './BeggaCard.treat'

/**
 * Ideal for employee lists and other profile cards
 */
export interface BeggaCardProps {
  variant?: 'icon' | 'image'
  icon?: 'warning'
  color?: keyof typeof colorMap
  image?: string
  title?: string
  description?: string
  link?: {
    url: string
    text: string
  }
}

const colorMap = {
  blue: 'blue400',
  red: 'red400',
}

export const BeggaCard: FC<BeggaCardProps> = ({
  variant = 'image',
  icon,
  color = 'blue',
  image,
  title,
  description,
  link,
}) => {
  return (
    <Box
      borderRadius="large"
      borderWidth="standard"
      borderColor="blue200"
      overflow="hidden"
    >
      {icon && (
        <Box
          display="flex"
          justifyContent={'center'}
          alignItems={'center'}
          paddingTop={2}
        >
          <Icon
            icon={icon}
            color={colorMap[color]}
            className={styles.iconStyle}
          />
        </Box>
      )}
      {image && (
        <Box
          className={styles.image}
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <Box padding={3} paddingTop={variant === 'icon' ? 1 : 2}>
        {title && (
          <Typography variant="h4" marginBottom={1}>
            {title}
          </Typography>
        )}
        {description && <Text variant="small">{description}</Text>}
        {link && (
          <Box paddingTop={2}>
            <Link href={link.url}>
              <Button
                icon="arrowForward"
                iconType="filled"
                type="button"
                variant="text"
                size="small"
              >
                {link.text}
              </Button>
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  )
}

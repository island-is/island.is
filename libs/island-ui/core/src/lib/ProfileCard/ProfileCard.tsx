import React, { FC } from 'react'
import { Box } from '../Box/Box'
import { Button } from '../Button/Button'
import { Link } from '../Link/Link'
import { Text } from '../Text/Text'
import * as styles from './ProfileCard.css'

/**
 * Ideal for employee lists and other profile cards
 */
export interface ProfileCardProps {
  /**
   * Image will be centered and scale with ratio 159:110
   */
  image?: string
  /**
   * Usually name or important short text
   */
  title?: string
  /**
   * Usually job description
   */
  description?: string
  /**
   * 100% height
   */
  heightFull?: boolean
  /**
   * Size of description and link
   */
  size?: 'small' | 'default'
  /**
   * Link at the bottom of card
   */
  link?: {
    url: string
    text: string
  }
}

export const ProfileCard: FC<ProfileCardProps> = ({
  image,
  title,
  description,
  heightFull,
  size = 'default',
  link,
}) => {
  const conditionalProps: { height?: 'full' } = {}
  if (heightFull) {
    conditionalProps.height = 'full'
  }
  return (
    <Box
      borderRadius="large"
      overflow="hidden"
      background="white"
      borderWidth="standard"
      borderColor="blue200"
      {...conditionalProps}
    >
      {image && (
        <Box
          className={styles.image}
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <Box padding={3}>
        {title && (
          <Text variant="h4" marginBottom={1}>
            {title}
          </Text>
        )}
        {description && <Text variant={size}>{description}</Text>}
        {link && (
          <Box paddingTop={2}>
            <Link href={link.url}>
              <Button
                icon="arrowForward"
                iconType="filled"
                type="button"
                variant="text"
                size={size}
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

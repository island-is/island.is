import React, { FC } from 'react'
import { Box } from '../Box/Box'
import { Typography } from '../Typography/Typography'
import * as styles from './ProfileCard.treat'

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
}

export const ProfileCard: FC<ProfileCardProps> = ({
  image,
  title,
  description,
  heightFull,
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
      boxShadow="subtle"
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
          <Typography variant="h4" marginBottom={1}>
            {title}
          </Typography>
        )}
        {description && <Typography variant="p">{description}</Typography>}
      </Box>
    </Box>
  )
}

export default ProfileCard

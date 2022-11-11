import { Box, Tag, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { ReviewSectionProps } from '../../../types'
import { useAuth } from '@island.is/auth/react'

export const StatusStep: FC<ReviewSectionProps> = ({
  title,
  description,
  tagVariant = 'blue',
  tagText = 'Í bið',
  visible = true,
  reviewer = [],
}) => {
  const { userInfo } = useAuth()
  const userNationalId = userInfo?.profile.nationalId || null
  if (!visible || !userNationalId) return null

  return (
    <Box
      position="relative"
      border="standard"
      borderRadius="large"
      marginBottom={2}
    >
      {/* Contents */}
      <Box padding={4}>
        <Box marginTop={[1, 0, 0]} paddingRight={[0, 1, 1]}>
          <Box display="flex" justifyContent="spaceBetween">
            <Text variant="h3">{title}</Text>
            <Tag variant={tagVariant} disabled>
              {tagText}
            </Tag>
          </Box>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="flexEnd"
            flexWrap={['wrap', 'nowrap']}
          >
            <Text marginTop={1} variant="default">
              {description}
            </Text>
          </Box>
          {reviewer.length > 0 &&
            !!reviewer.find((reviewerItem) => !reviewerItem.approved) && (
              <Box>
                {reviewer.map((reviewerItem) => {
                  return (
                    <Text
                      marginTop={1}
                      variant="eyebrow"
                      color={reviewerItem.approved ? 'mint600' : 'red600'}
                    >
                      {reviewerItem.name}{' '}
                      {userNationalId === reviewerItem.nationalId ? '(þú)' : ''}
                    </Text>
                  )
                })}
              </Box>
            )}
        </Box>
      </Box>
    </Box>
  )
}

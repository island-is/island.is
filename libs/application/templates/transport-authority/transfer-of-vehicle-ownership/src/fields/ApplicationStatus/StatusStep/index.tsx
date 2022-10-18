import { Box, Button, Tag, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import * as styles from './StatusStep.css'
import { ReviewSectionProps } from './types'

export const StatusStep: FC<ReviewSectionProps> = ({
  title,
  description,
  tagVariant = 'blue',
  tagText = 'Í bið',
  hasActionMessage,
  action,
  visible = true,
}) => {
  const handleOnCTAButtonClick = () => {
    action?.cta && action.cta()
  }
  if (!visible) return null

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
            {!hasActionMessage && action && action.showAlways && (
              <Box className={styles.flexNone}>
                <Button
                  colorScheme="default"
                  icon={action.hasActionButtonIcon ? 'attach' : undefined}
                  iconType="filled"
                  size="small"
                  type="button"
                  variant="text"
                  onClick={handleOnCTAButtonClick}
                >
                  {action.actionButtonTitle}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

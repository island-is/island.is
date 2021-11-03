import { Application } from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'
import cn from 'classnames'
import React, { FC } from 'react'
import { ReviewSectionState } from '../../../types'
import * as styles from './ReviewSection.css'
import { ReviewTag } from './ReviewTag'

type ActionProps = {
  title: string
  description: string
  fileNames?: string
  actionButtonTitle: string
  hasActionButtonIcon?: boolean
  showAlways?: boolean
  cta?: () => void
}

type ReviewSectionProps = {
  application: Application
  title: string
  description: string
  state?: ReviewSectionState
  hasActionMessage: boolean
  goToScreen: (id: string) => void
  action?: ActionProps
  visible?: boolean
}

export const StatusStep: FC<ReviewSectionProps> = ({
  application,
  title,
  description,
  state,
  hasActionMessage,
  action,
  goToScreen,
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
            <ReviewTag application={application} state={state} />
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
              <Box className={cn(styles.flexNone)}>
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

      {/* Action messages */}
      {hasActionMessage && action && (
        <Box
          alignItems="flexStart"
          display="flex"
          flexDirection={['columnReverse', 'row']}
          justifyContent="spaceBetween"
          background="roseTinted100"
          padding={4}
        >
          <Box marginTop={[1, 0, 0]} paddingRight={[0, 1, 1]}>
            <Text variant="h5">{action.title}</Text>
            <Text marginTop={1} variant="default">
              {action.description}{' '}
              {action.fileNames && (
                <span className={cn(styles.boldFileNames)}>
                  {action.fileNames}
                </span>
              )}
            </Text>
            <Box marginTop={1}>
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
          </Box>
        </Box>
      )}
    </Box>
  )
}

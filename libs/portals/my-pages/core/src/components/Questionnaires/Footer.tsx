import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { m } from '../../lib/messages'

interface FooterButtonsProps {
  onSubmit?: () => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  enableStepper?: boolean
  canGoPrevious?: boolean
  canGoNext?: boolean
  handlePrevious?: () => void
  handleNext?: () => void
}

export const QuestionnaireFooter: React.FC<FooterButtonsProps> = ({
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel,
  enableStepper = false,
  canGoPrevious = false,
  canGoNext = false,
  handlePrevious,
  handleNext,
}) => {
  const { formatMessage } = useLocale()
  return enableStepper ? (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      alignItems="center"
      paddingX={10}
      paddingBottom={4}
    >
      <Box>
        {canGoPrevious && (
          <Button variant="ghost" onClick={handlePrevious}>
            {formatMessage(m.lastQuestion)}
          </Button>
        )}
      </Box>
      <Box>
        {canGoNext ? (
          <Button variant="primary" onClick={handleNext}>
            {formatMessage(m.nextQuestion)}
          </Button>
        ) : (
          <Button variant="primary" onClick={onSubmit}>
            {formatMessage(m.submit)}
          </Button>
        )}
      </Box>
    </Box>
  ) : (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      paddingX={[0, 0, 0, enableStepper ? 10 : 3]}
      paddingY={2}
      paddingBottom={4}
    >
      <Box>
        <Button variant="ghost" onClick={onCancel}>
          {cancelLabel ? cancelLabel : formatMessage(m.buttonCancel)}
        </Button>
      </Box>
      <Box>
        <Button variant="primary" onClick={onSubmit}>
          {submitLabel ? submitLabel : formatMessage(m.submit)}
        </Button>
      </Box>
    </Box>
  )
}

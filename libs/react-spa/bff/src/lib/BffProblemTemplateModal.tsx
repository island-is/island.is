import { Box, Button, ProblemTemplate } from '@island.is/island-ui/core'
import { fullScreen } from './ErrorScreen.css'

export type BffProblemTemplateModalProps = {
  title: string
  action: {
    prefixText: string
    text: string
    postfixText: string
    onClick(): void
  }
}

/**
 * Reusable warning screen for BFF
 */
export const BffProblemTemplateModal = ({
  title,
  action: { prefixText, text, postfixText, onClick },
}: BffProblemTemplateModalProps) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    padding={[0, 6]}
    className={fullScreen}
  >
    <ProblemTemplate
      variant="warning"
      expand
      title={title}
      message={
        <>
          {prefixText}{' '}
          <Button variant="text" onClick={onClick}>
            {text}
          </Button>{' '}
          {postfixText}
        </>
      }
    />
  </Box>
)

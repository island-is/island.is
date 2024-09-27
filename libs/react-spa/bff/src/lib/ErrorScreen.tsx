import { Box, Button, ProblemTemplate } from '@island.is/island-ui/core'
import { fullScreen } from './ErrorScreen.css'

type ErrorScreenProps = {
  title?: string
  /**
   * Retry callback
   */
  onRetry(): void
}

/**
 * This screen is unfortunately not translated because at this point we don't have a user locale.
 */
export const ErrorScreen = ({
  title = 'Innskráning mistókst',
  onRetry,
}: ErrorScreenProps) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    padding={[0, 6]}
    className={fullScreen}
  >
    <ProblemTemplate
      variant="error"
      expand
      tag="Villa"
      title={title}
      message={
        <>
          Vinsamlegast reyndu aftur síðar.{' '}
          <Button variant="text" onClick={onRetry}>
            Reyna aftur
          </Button>
        </>
      }
    />
  </Box>
)

import { Box, Button, ProblemTemplate } from '@island.is/island-ui/core'
import { fullScreen } from './ErrorScreen.css'

type BffSessionExpiredModalProps = {
  /**
   * Login callback
   */
  onLogin(): void
}

/**
 * This screen is unfortunately not translated because at this point we don't have a user locale.
 */
export const BffSessionExpiredModal = ({
  onLogin,
}: BffSessionExpiredModalProps) => (
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
      tag=""
      title="Innskráning útrunnin"
      message={
        <>
          Þú hefur skráð þig inn í öðru umboði. Viltu{' '}
          <Button variant="text" onClick={onLogin}>
            skrá þig
          </Button>{' '}
          aftur inn?
        </>
      }
    />
  </Box>
)

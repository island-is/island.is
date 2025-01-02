import { Box, Button, ProblemTemplate } from '@island.is/island-ui/core'
import { buttonWrapper } from './BffDoubleSession.css'
import { fullScreen } from './ErrorScreen.css'

type BffDoubleSessionModalProps = {
  onSwitchUser(): void
  onKeepCurrentUser(): void
}

/**
 * Modal that handles cases where multiple active sessions are detected for a user.
 * This typically occurs in one of these scenarios:
 *
 * 1. User logs in normally, then uses browser back button to return to login page
 * 2. User logs in again while having an active session
 * 3. This creates a conflict where two active sessions exist simultaneously
 *
 * Resolution options:
 * 1. Switch User: Activates the new login session
 * 2. Keep Current: Maintains the existing active session
 *
 * Note: This component is not translated as it appears before user locale is available
 */
export const BffDoubleSessionModal = ({
  onSwitchUser,
  onKeepCurrentUser,
}: BffDoubleSessionModalProps) => (
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
      title="Tvöföld innskráning"
      message={
        <>
          Við höfum greint að þú ert með tvær virkar innskráningar í gangi.
          Vinsamlegast veldu annað hvort að
          <br />
          <span className={buttonWrapper}>
            <Button variant="text" onClick={() => onSwitchUser()}>
              skipta um notanda
            </Button>{' '}
            eða{' '}
            <Button variant="text" onClick={() => onKeepCurrentUser()}>
              halda fyrri innskráningu
            </Button>
          </span>
        </>
      }
    />
  </Box>
)

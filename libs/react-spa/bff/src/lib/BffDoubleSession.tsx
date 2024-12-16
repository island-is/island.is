import { Box, Button, ProblemTemplate } from '@island.is/island-ui/core'
import { buttonWrapper } from './BffDoubleSession.css'
import { fullScreen } from './ErrorScreen.css'

type BffDoubleSessionModalProps = {
  onSwitchUser(): void
  onKeepCurrentUser(): void
}

/**
 * This is a special modal when a user has done something he shouldn't have done. Which results in two active sessions.
 * User login as normal, but then he presses the back button, which causes the user to be routed to the login page.
 * The user then re-logs in, but the previous session is still active and the user teqnically has two sessions.
 * This user gives the user a warning and a possibility to either:
 * 1. Switch user to get correct new session.
 * 2. Keep the current user session and continue.
 *
 * Note: This screen is unfortunately not translated because at this point we don't have a user locale.
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
            .
          </span>
        </>
      }
    />
  </Box>
)

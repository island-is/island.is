import { Box, Button, ProblemTemplate } from '@island.is/island-ui/core'
import { fullScreen } from './ErrorScreen.css'

export type SessionExpiredReason = 'expired' | 'session-changed'

type BffSessionExpiredModalProps = {
  reason: SessionExpiredReason
  /**
   * Login callback
   */
  onLogin(): void
}

/**
 * This screen is unfortunately not translated because at this point we don't have a user locale.
 */
export const BffSessionExpiredModal = ({
  reason,
  onLogin,
}: BffSessionExpiredModalProps) => {
  const message =
    reason === 'expired' ? (
      <>
        Innskráning þín er útrunnin vegna óvirkni. Vinsamlegast{' '}
        <Button variant="text" onClick={onLogin}>
          skráðu þig inn
        </Button>{' '}
        aftur.
      </>
    ) : (
      <>
        Þú hefur skráð þig inn í öðru umboði. Viltu{' '}
        <Button variant="text" onClick={onLogin}>
          skrá þig
        </Button>{' '}
        aftur inn?
      </>
    )

  const title =
    reason === 'session-changed'
      ? 'Ný innskráning á öðru stæði'
      : 'Innskráning útrunnin'

  return (
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
        title={title}
        message={message}
      />
    </Box>
  )
}

import type { ReactNode } from 'react'

import { AlertMessage, Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useBffUrlGenerator, useUserInfo } from '@island.is/react-spa/bff'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'

import { messages } from '../../lib/messages'

const HIGH_ASSURANCE = 'eidas-loa-high'

/**
 * Health information needs a session logged in with electronic ID. A session
 * opened another way — a passkey, e.g. Mínar síður opened from the app — is
 * asked to log in again; the API refuses it either way.
 */
export const HighAssuranceGate = ({ children }: { children: ReactNode }) => {
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()
  const bffUrlGenerator = useBffUrlGenerator()
  // Read as the API reads it: if the flag can't be read, the API refuses the
  // data, so this asks for the login rather than leaving the page to fail.
  const { value: required, loading } = useFeatureFlag(
    Features.isHealthStepUpRequired,
    true,
  )

  const acr = (userInfo?.profile as { acr?: string } | undefined)?.acr

  if (loading) {
    return null
  }

  if (!required || acr === HIGH_ASSURANCE) {
    return <>{children}</>
  }

  const logInAgain = () => {
    // prompt=login: a fresh login, not the session we already have.
    window.location.href = bffUrlGenerator('/login', {
      target_link_uri: window.location.href,
      prompt: 'login',
    })
  }

  return (
    <Box display="flex" flexDirection="column" rowGap={3} paddingY={4}>
      <AlertMessage
        type="info"
        title={formatMessage(messages.highAssuranceRequiredTitle)}
        message={formatMessage(messages.highAssuranceRequiredMessage)}
      />
      <Box>
        <Button onClick={logInAgain} size="small">
          {formatMessage(messages.highAssuranceRequiredLogin)}
        </Button>
      </Box>
    </Box>
  )
}

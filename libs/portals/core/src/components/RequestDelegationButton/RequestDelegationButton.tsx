import { useNavigate } from 'react-router-dom'

import { Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import { useAuth, useUserInfo } from '@island.is/react-spa/bff'

import { m } from '../../lib/messages'
import {
  DELEGATION_REQUEST_GRANTOR_KEY,
  getDelegationRequestPath,
} from '../../utils/delegationRequest'

interface RequestDelegationButtonProps {
  scopes?: string[]
  variant?: 'primary' | 'ghost' | 'text' | 'utility'
  size?: 'default' | 'small' | 'medium'
}

export const RequestDelegationButton = ({
  scopes,
  variant = 'text',
  size = 'small',
}: RequestDelegationButtonProps) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { switchUser } = useAuth()
  const user = useUserInfo()
  const { value: enabled } = useFeatureFlag(
    Features.isDelegationRequestsEnabled,
    false,
  )

  if (!enabled || !scopes?.length) {
    return null
  }

  const target = getDelegationRequestPath(scopes)
  const actorNationalId = user?.profile?.actor?.nationalId

  const onClick = () => {
    if (actorNationalId) {
      const grantorNationalId = user?.profile?.nationalId
      if (grantorNationalId) {
        try {
          window.sessionStorage.setItem(
            DELEGATION_REQUEST_GRANTOR_KEY,
            JSON.stringify({
              nationalId: grantorNationalId,
              name: user?.profile?.name ?? '',
            }),
          )
        } catch {
          // noop
        }
      }
      switchUser(
        actorNationalId,
        `${window.location.origin}/minarsidur${target}`,
      )
    } else {
      navigate(target)
    }
  }

  return (
    <Button variant={variant} size={size} icon="arrowForward" onClick={onClick}>
      {formatMessage(m.requestDelegationCta)}
    </Button>
  )
}

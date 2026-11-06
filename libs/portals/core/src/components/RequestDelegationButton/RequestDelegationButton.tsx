import { Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import { useAuth, useUserInfo } from '@island.is/react-spa/bff'

import { m } from '../../lib/messages'
import {
  getDelegationRequestPath,
  storeDelegationRequestGrantor,
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
  const { switchUser } = useAuth()
  const user = useUserInfo()
  const { value: enabled } = useFeatureFlag(
    Features.isDelegationRequestsEnabled,
    false,
  )

  const actorNationalId = user?.profile?.actor?.nationalId

  if (!enabled || !scopes?.length || !actorNationalId) {
    return null
  }

  const onClick = () => {
    const grantorNationalId = user?.profile?.nationalId
    if (grantorNationalId) {
      storeDelegationRequestGrantor(
        { nationalId: grantorNationalId, name: user?.profile?.name ?? '' },
        actorNationalId,
      )
    }
    switchUser(
      actorNationalId,
      `${window.location.origin}/minarsidur${getDelegationRequestPath(scopes)}`,
    )
  }

  return (
    <Button variant={variant} size={size} icon="arrowForward" onClick={onClick}>
      {formatMessage(m.requestDelegationCta)}
    </Button>
  )
}

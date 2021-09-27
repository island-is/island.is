import React from 'react'
import { Button, Hidden, Inline, UserAvatar } from '@island.is/island-ui/core'
import { User } from '@island.is/shared/types'
import { useLocale } from '@island.is/localization'
import { userMessages } from '@island.is/shared/translations'
import * as styles from './UserMenu.treat'

interface UserButtonProps {
  user: User
  onClick: () => void
}

export const UserButton = ({ onClick, user: { profile } }: UserButtonProps) => {
  const isDelegation = Boolean(profile.actor)
  const { formatMessage } = useLocale()
  return (
    <>
      <Hidden above="xs">
        <UserAvatar
          isDelegation={isDelegation}
          username={profile.name}
          onClick={onClick}
          aria-label={formatMessage(userMessages.userButtonAria)}
        />
      </Hidden>
      <Hidden below="sm">
        <Button
          variant="utility"
          colorScheme={isDelegation ? 'primary' : 'default'}
          onClick={onClick}
          icon="chevronDown"
          aria-label={formatMessage(userMessages.userButtonAria)}
        >
          <div className={styles.resetButtonPadding}>
            {isDelegation ? (
              <>
                <div className={styles.delegationName}>{profile.name}</div>
                <div className={styles.actorName}>{profile.actor!.name}</div>
              </>
            ) : (
              <Inline space={1} alignY="center">
                <UserAvatar size="small" username={profile.name} />
                {profile.name}
              </Inline>
            )}
          </div>
        </Button>
      </Hidden>
    </>
  )
}

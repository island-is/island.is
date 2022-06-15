import React from 'react'
import {
  Button,
  Hidden,
  Inline,
  UserAvatar,
  Box,
} from '@island.is/island-ui/core'
import { User } from '@island.is/shared/types'
import { useLocale } from '@island.is/localization'
import { userMessages } from '@island.is/shared/translations'
import * as styles from './UserMenu.css'
import { checkDelegation } from '@island.is/service-portal/core'

interface UserButtonProps {
  user: User
  small: boolean
  onClick: () => void
}

export const UserButton = ({ onClick, user, small }: UserButtonProps) => {
  const isDelegation = checkDelegation(user)
  const { profile } = user
  const { formatMessage } = useLocale()
  return (
    <>
      <Hidden above="sm">
        {small ? (
          <Box className={styles.smallAvatar}>
            <UserAvatar
              isDelegation={isDelegation}
              username={profile.name}
              onClick={onClick}
              aria-label={formatMessage(userMessages.userButtonAria)}
            />
          </Box>
        ) : (
          <Button
            variant="utility"
            colorScheme={isDelegation ? 'primary' : 'default'}
            onClick={onClick}
            icon="person"
            iconType="outline"
            aria-label={formatMessage(userMessages.userButtonAria)}
          >
            <div className={styles.resetButtonPadding}>
              {
                <Inline space={1} alignY="center">
                  {profile.name.split(' ')[0]}
                </Inline>
              }
            </div>
          </Button>
        )}
      </Hidden>
      <Hidden below="md">
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
              profile.name
            )}
          </div>
        </Button>
      </Hidden>
    </>
  )
}

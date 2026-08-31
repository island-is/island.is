import React, { useMemo } from 'react'
import { useLoaderData, useNavigation } from 'react-router-dom'

import { Box, FilterInput } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'

import { m } from '../../../lib/messages'
import { useDebouncedSearch } from '../ApiScopeUsers/hooks/useDebouncedSearch'
import { UserClaimsModal } from './components/UserClaimsModal'
import { UserIdentitiesTable } from './components/UserIdentitiesTable'
import { UserIdentityConfirmModal } from './components/UserIdentityConfirmModal'
import { useUserIdentityActions } from './hooks/useUserIdentityActions'
import type { UserIdentitiesLoaderData } from './UserIdentities.loader'
import type { UserIdentityRow } from './UserIdentities.types'

const UserIdentities = () => {
  const { formatMessage } = useLocale()
  const data = useLoaderData() as UserIdentitiesLoaderData
  const navigation = useNavigation()

  const configuredEnvironments = useMemo(
    () => data?.configuredEnvironments ?? [],
    [data?.configuredEnvironments],
  )

  const { localSearch, handleSearch, clearSearch } = useDebouncedSearch()

  const actions = useUserIdentityActions()

  const rows: UserIdentityRow[] = useMemo(
    () =>
      (data?.userIdentities ?? []).map((row) => ({
        subjectId: row.subjectId,
        name: row.name,
        providerName: row.providerName,
        providerSubjectId: row.providerSubjectId,
        availableEnvironments: row.availableEnvironments,
        activeEnvironments: row.activeEnvironments,
        deactivatedEnvironments: row.deactivatedEnvironments,
        claims: row.claims,
      })),
    [data?.userIdentities],
  )

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.userIdentities)}
        intro={formatMessage(m.userIdentitiesIntro)}
      />

      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="flexEnd"
        marginBottom={3}
        columnGap={2}
      >
        <Box flexGrow={1} style={{ maxWidth: 400 }}>
          <FilterInput
            placeholder={formatMessage(m.userIdentitiesSearchPlaceholder)}
            name="user-identities-search"
            value={localSearch}
            onChange={handleSearch}
            backgroundColor="blue"
          />
        </Box>
      </Box>

      <UserIdentitiesTable
        rows={rows}
        search={data?.search ?? ''}
        loading={navigation.state === 'loading'}
        onViewClaims={actions.openClaims}
        onDeactivate={actions.openDeactivate}
        onReactivate={actions.openReactivate}
        onClearSearch={clearSearch}
      />

      {actions.claimsTarget && (
        <UserClaimsModal
          target={actions.claimsTarget}
          onClose={actions.closeClaims}
        />
      )}

      {actions.deactivateTarget && (
        <UserIdentityConfirmModal
          variant="deactivate"
          target={actions.deactivateTarget}
          configuredEnvironments={configuredEnvironments}
          onConfirm={actions.handleDeactivate}
          onClose={actions.closeDeactivate}
        />
      )}

      {actions.reactivateTarget && (
        <UserIdentityConfirmModal
          variant="reactivate"
          target={actions.reactivateTarget}
          configuredEnvironments={configuredEnvironments}
          onConfirm={actions.handleReactivate}
          onClose={actions.closeReactivate}
        />
      )}
    </Box>
  )
}

export default UserIdentities

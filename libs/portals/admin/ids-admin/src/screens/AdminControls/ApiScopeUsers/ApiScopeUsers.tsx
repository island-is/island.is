import { useMemo } from 'react'
import { useLoaderData, useNavigation } from 'react-router-dom'

import { Box, Button, FilterInput } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'

import { m } from '../../../lib/messages'
import type { ApiScopeUsersLoaderData } from './ApiScopeUsers.loader'
import { PAGE_SIZE } from './ApiScopeUsers.utils'
import { useDebouncedSearch } from './hooks/useDebouncedSearch'
import { useApiScopeUserModal } from './hooks/useApiScopeUserModal'
import { ApiScopeUsersTable } from './components/ApiScopeUsersTable'
import { ApiScopeUserModal } from './components/ApiScopeUserModal'

const ApiScopeUsers = () => {
  const { formatMessage } = useLocale()
  const data = useLoaderData() as ApiScopeUsersLoaderData

  const accessControlledScopes = useMemo(
    () => data?.accessControlledScopes ?? [],
    [data?.accessControlledScopes],
  )
  const configuredEnvironments = useMemo(
    () => data?.configuredEnvironments ?? [],
    [data?.configuredEnvironments],
  )

  const navigation = useNavigation()
  const {
    localSearch,
    currentPage,
    handleSearch,
    handlePageChange,
    clearSearch,
  } = useDebouncedSearch()

  const modal = useApiScopeUserModal({
    accessControlledScopes,
    configuredEnvironments,
  })

  const totalPages = Math.ceil((data?.users.totalCount ?? 0) / PAGE_SIZE)

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.apiScopeUsers)}
        intro={formatMessage(m.apiScopeUsersDescription)}
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
            placeholder={formatMessage(m.apiScopeUsersSearchPlaceholder)}
            name="api-scope-users-search"
            value={localSearch}
            onChange={handleSearch}
            backgroundColor="blue"
          />
        </Box>
        <Button size="small" onClick={modal.openCreateModal}>
          {formatMessage(m.apiScopeUsersCreateNew)}
        </Button>
      </Box>

      <ApiScopeUsersTable
        rows={data.users.rows}
        currentPage={currentPage}
        totalPages={totalPages}
        configuredEnvironments={configuredEnvironments}
        search={localSearch}
        loading={navigation.state === 'loading'}
        onEdit={modal.openEditModal}
        onDelete={modal.handleDelete}
        onPageChange={handlePageChange}
        onClearSearch={clearSearch}
      />

      <ApiScopeUserModal modal={modal} />
    </Box>
  )
}

export default ApiScopeUsers

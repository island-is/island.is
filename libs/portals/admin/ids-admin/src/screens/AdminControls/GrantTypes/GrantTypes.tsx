import React, { useMemo } from 'react'
import { useLoaderData, useNavigation } from 'react-router-dom'

import { Box, Button, FilterInput } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'

import { m } from '../../../lib/messages'
import type { GrantTypesLoaderData } from './GrantTypes.loader'
import { PAGE_SIZE } from './GrantTypes.utils'
import { useDebouncedSearch } from '../ApiScopeUsers/hooks/useDebouncedSearch'
import { useGrantTypeModal } from './hooks/useGrantTypeModal'
import { GrantTypesTable } from './components/GrantTypesTable'
import { GrantTypeModal } from './components/GrantTypeModal'

const GrantTypes = () => {
  const { formatMessage } = useLocale()
  const data = useLoaderData() as GrantTypesLoaderData

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

  const modal = useGrantTypeModal({
    configuredEnvironments,
  })

  const totalPages = Math.ceil((data?.grantTypes.totalCount ?? 0) / PAGE_SIZE)

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.grantTypes)}
        intro={formatMessage(m.grantTypesIntro)}
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
            placeholder={formatMessage(m.grantTypesSearchPlaceholder)}
            name="grant-types-search"
            value={localSearch}
            onChange={handleSearch}
            backgroundColor="blue"
          />
        </Box>
        <Button size="small" onClick={modal.openCreateModal}>
          {formatMessage(m.grantTypesCreateNew)}
        </Button>
      </Box>

      <GrantTypesTable
        rows={data.grantTypes.rows}
        currentPage={currentPage}
        totalPages={totalPages}
        configuredEnvironments={configuredEnvironments}
        search={localSearch}
        loading={navigation.state === 'loading'}
        onEdit={modal.openEditModal}
        onDelete={modal.handleDelete}
        onRestore={modal.handleRestore}
        onPageChange={handlePageChange}
        onClearSearch={clearSearch}
      />

      <GrantTypeModal modal={modal} />
    </Box>
  )
}

export default GrantTypes

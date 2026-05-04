import React, { useMemo } from 'react'
import { useLoaderData } from 'react-router-dom'

import { Box, Button, FilterInput } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'

import { m } from '../../../lib/messages'
import type { IdpProvidersLoaderData } from './IdpProviders.loader'
import { PAGE_SIZE } from './IdpProviders.utils'
import { useDebouncedSearch } from '../ApiScopeUsers/hooks/useDebouncedSearch'
import { useIdpProviderModal } from './hooks/useIdpProviderModal'
import { IdpProvidersTable } from './components/IdpProvidersTable'
import { IdpProviderModal } from './components/IdpProviderModal'

const IdpProviders = () => {
  const { formatMessage } = useLocale()
  const data = useLoaderData() as IdpProvidersLoaderData

  const configuredEnvironments = useMemo(
    () => data?.configuredEnvironments ?? [],
    [data?.configuredEnvironments],
  )

  const { localSearch, currentPage, handleSearch, handlePageChange } =
    useDebouncedSearch()

  const modal = useIdpProviderModal({
    configuredEnvironments,
  })

  const totalPages = Math.ceil((data?.idpProviders.totalCount ?? 0) / PAGE_SIZE)

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.idpProviders)}
        intro={formatMessage(m.idpProvidersIntro)}
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
            placeholder={formatMessage(m.idpProvidersSearchPlaceholder)}
            name="idp-providers-search"
            value={localSearch}
            onChange={handleSearch}
            backgroundColor="blue"
          />
        </Box>
        <Button size="small" onClick={modal.openCreateModal}>
          {formatMessage(m.idpProvidersCreateNew)}
        </Button>
      </Box>

      <IdpProvidersTable
        rows={data.idpProviders.rows}
        currentPage={currentPage}
        totalPages={totalPages}
        configuredEnvironments={configuredEnvironments}
        onEdit={modal.openEditModal}
        onDelete={modal.handleDelete}
        onPageChange={handlePageChange}
      />

      <IdpProviderModal modal={modal} />
    </Box>
  )
}

export default IdpProviders

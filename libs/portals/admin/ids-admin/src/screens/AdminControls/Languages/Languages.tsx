import React, { useMemo } from 'react'
import { useLoaderData, useNavigation } from 'react-router-dom'

import { Box, Button, FilterInput } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'

import { m } from '../../../lib/messages'
import { useDebouncedSearch } from '../ApiScopeUsers/hooks/useDebouncedSearch'
import type { LanguagesLoaderData } from './Languages.loader'
import { PAGE_SIZE } from './Languages.utils'
import { useLanguageModal } from './hooks/useLanguageModal'
import { LanguagesTable } from './components/LanguagesTable'
import { LanguageModal } from './components/LanguageModal'

const Languages = () => {
  const { formatMessage } = useLocale()
  const data = useLoaderData() as LanguagesLoaderData

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

  const modal = useLanguageModal({
    configuredEnvironments,
  })

  const totalPages = Math.ceil((data?.languages.totalCount ?? 0) / PAGE_SIZE)

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.languages)}
        intro={formatMessage(m.languagesIntro)}
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
            placeholder={formatMessage(m.languagesSearchPlaceholder)}
            name="languages-search"
            value={localSearch}
            onChange={handleSearch}
            backgroundColor="blue"
          />
        </Box>
        <Button size="small" onClick={modal.openCreateModal}>
          {formatMessage(m.languagesCreateNew)}
        </Button>
      </Box>

      <LanguagesTable
        rows={data.languages.rows}
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

      <LanguageModal modal={modal} />
    </Box>
  )
}

export default Languages

import React, { useMemo } from 'react'
import { useLoaderData, useNavigation } from 'react-router-dom'

import { Box, Button, FilterInput } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'

import { m } from '../../../lib/messages'
import { useDebouncedSearch } from '../ApiScopeUsers/hooks/useDebouncedSearch'
import type { TranslationsLoaderData } from './Translations.loader'
import { PAGE_SIZE } from './Translations.utils'
import { useTranslationModal } from './hooks/useTranslationModal'
import { TranslationsTable } from './components/TranslationsTable'
import { TranslationModal } from './components/TranslationModal'

const Translations = () => {
  const { formatMessage } = useLocale()
  const data = useLoaderData() as TranslationsLoaderData

  const configuredEnvironments = useMemo(
    () => data?.configuredEnvironments ?? [],
    [data?.configuredEnvironments],
  )

  const languageOptions = useMemo(
    () =>
      (data?.languages ?? []).map((language) => ({
        label: `${language.isoKey} — ${language.englishDescription}`,
        value: language.isoKey,
      })),
    [data?.languages],
  )

  const navigation = useNavigation()
  const {
    localSearch,
    currentPage,
    handleSearch,
    handlePageChange,
    clearSearch,
  } = useDebouncedSearch()

  const modal = useTranslationModal({
    configuredEnvironments,
    languageOptions,
  })

  const totalPages = Math.ceil((data?.translations.totalCount ?? 0) / PAGE_SIZE)

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.translationsTitle)}
        intro={formatMessage(m.translationsIntro)}
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
            placeholder={formatMessage(m.translationsSearchPlaceholder)}
            name="translations-search"
            value={localSearch}
            onChange={handleSearch}
            backgroundColor="blue"
          />
        </Box>
        <Button size="small" onClick={modal.openCreateModal}>
          {formatMessage(m.translationsCreateNew)}
        </Button>
      </Box>

      <TranslationsTable
        rows={data.translations.rows}
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

      <TranslationModal modal={modal} />
    </Box>
  )
}

export default Translations

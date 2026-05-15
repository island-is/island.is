import React, { useState } from 'react'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import {
  Box,
  Button,
  LoadingDots,
  Pagination,
  Stack,
  Table as T,
  Tag,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'

import { m } from '../../../../lib/messages'
import type { LanguageRow } from '../Languages.types'
import { LanguageConfirmModal } from './LanguageConfirmModal'

interface LanguagesTableProps {
  rows: LanguageRow[]
  currentPage: number
  totalPages: number
  configuredEnvironments: AuthAdminEnvironment[]
  search?: string
  loading?: boolean
  onEdit: (language: LanguageRow) => void
  onDelete: (isoKey: string, environments: AuthAdminEnvironment[]) => void
  onPageChange: (page: number) => void
  onClearSearch?: () => void
}

export const LanguagesTable = ({
  rows,
  currentPage,
  totalPages,
  configuredEnvironments,
  search,
  loading,
  onEdit,
  onDelete,
  onPageChange,
  onClearSearch,
}: LanguagesTableProps) => {
  const { formatMessage } = useLocale()

  const [deleteTarget, setDeleteTarget] = useState<LanguageRow | null>(null)

  const handleDeleteConfirm = (
    isoKey: string,
    environments: AuthAdminEnvironment[],
  ) => {
    onDelete(isoKey, environments)
    setDeleteTarget(null)
  }

  return (
    <Stack space={3}>
      {rows.length === 0 ? (
        <Box
          padding={4}
          textAlign="center"
          border="standard"
          borderRadius="large"
        >
          {loading ? (
            <LoadingDots />
          ) : (
            <Problem
              type="no_data"
              title={formatMessage(
                search ? m.noResultsForSearch : m.languagesNoResults,
              )}
              message={
                search && onClearSearch ? (
                  <Box marginTop={2}>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={onClearSearch}
                    >
                      {formatMessage(m.clearFilter)}
                    </Button>
                  </Box>
                ) : undefined
              }
              titleSize="h3"
            />
          )}
        </Box>
      ) : (
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>{formatMessage(m.languagesIsoKey)}</T.HeadData>
              <T.HeadData>{formatMessage(m.languagesDescription)}</T.HeadData>
              <T.HeadData>
                {formatMessage(m.languagesEnglishDescription)}
              </T.HeadData>
              <T.HeadData>{formatMessage(m.environments)}</T.HeadData>
              <T.HeadData>{/* Actions */}</T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {rows.map((language) => (
              <T.Row key={language.isoKey}>
                <T.Data>{language.isoKey}</T.Data>
                <T.Data>{language.description}</T.Data>
                <T.Data>{language.englishDescription}</T.Data>
                <T.Data>
                  <Box display="flex" flexWrap="wrap" columnGap={1} rowGap={1}>
                    {language.availableEnvironments?.map((env) => (
                      <Tag key={env} variant="blue" outlined disabled>
                        {env}
                      </Tag>
                    ))}
                  </Box>
                </T.Data>
                <T.Data>
                  <Box display="flex" columnGap={2} justifyContent="flexEnd">
                    <Button
                      aria-label={formatMessage(m.edit)}
                      variant="ghost"
                      size="small"
                      icon="pencil"
                      onClick={() => onEdit(language)}
                    />
                    <Button
                      aria-label={formatMessage(m.delete)}
                      variant="ghost"
                      size="small"
                      icon="trash"
                      colorScheme="destructive"
                      onClick={() => setDeleteTarget(language)}
                    />
                  </Box>
                </T.Data>
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
      )}

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center">
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            renderLink={(page, className, children) => (
              <button
                type="button"
                className={className}
                onClick={() => onPageChange(page)}
              >
                {children}
              </button>
            )}
          />
        </Box>
      )}

      {deleteTarget && (
        <LanguageConfirmModal
          target={deleteTarget}
          configuredEnvironments={configuredEnvironments}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </Stack>
  )
}

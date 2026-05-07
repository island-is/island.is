import React, { Fragment, useState } from 'react'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import {
  Box,
  Button,
  LoadingDots,
  Pagination,
  Stack,
  Table as T,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'

import { m } from '../../../../lib/messages'
import type { TranslationRow } from '../Translations.types'
import { buildTranslationKey } from '../Translations.utils'
import { TranslationConfirmModal } from './TranslationConfirmModal'
import * as styles from './Translations.css'

interface TranslationsTableProps {
  rows: TranslationRow[]
  currentPage: number
  totalPages: number
  configuredEnvironments: AuthAdminEnvironment[]
  search?: string
  loading?: boolean
  onEdit: (translation: TranslationRow) => void
  onDelete: (
    translation: TranslationRow,
    environments: AuthAdminEnvironment[],
  ) => void
  onPageChange: (page: number) => void
  onClearSearch?: () => void
}

const renderBreakableKey = (key: string) =>
  key.split(/(?=[/:])/).map((segment, index) => (
    <Fragment key={index}>
      {index > 0 && <wbr />}
      {segment}
    </Fragment>
  ))

export const TranslationsTable = ({
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
}: TranslationsTableProps) => {
  const { formatMessage } = useLocale()

  const [deleteTarget, setDeleteTarget] = useState<TranslationRow | null>(null)

  const handleDeleteConfirm = (
    translation: TranslationRow,
    environments: AuthAdminEnvironment[],
  ) => {
    onDelete(translation, environments)
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
                search ? m.noResultsForSearch : m.translationsNoResults,
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
        <Box className={styles.tableWrapper}>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>
                  {formatMessage(m.translationsLanguageShort)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(m.translationsClassNameShort)} /{' '}
                  {formatMessage(m.translationsKey)}
                </T.HeadData>
                <T.HeadData>{formatMessage(m.translationsProperty)}</T.HeadData>
                <T.HeadData>{formatMessage(m.translationsValue)}</T.HeadData>
                <T.HeadData>{formatMessage(m.environments)}</T.HeadData>
                <T.HeadData>{/* Actions */}</T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {rows.map((translation) => (
                <T.Row key={buildTranslationKey(translation)}>
                  <T.Data>{translation.language}</T.Data>
                  <T.Data>
                    <Box
                      display="flex"
                      flexDirection="column"
                      className={styles.classKey}
                    >
                      <Text variant="small">{translation.className}</Text>
                      <Text variant="small" fontWeight="medium">
                        {renderBreakableKey(translation.key)}
                      </Text>
                    </Box>
                  </T.Data>
                  <T.Data>{translation.property}</T.Data>
                  <T.Data>{translation.value}</T.Data>
                  <T.Data>
                    <Box
                      display="flex"
                      flexWrap="wrap"
                      columnGap={1}
                      rowGap={1}
                    >
                      {translation.availableEnvironments?.map((env) => (
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
                        onClick={() => onEdit(translation)}
                      />
                      <Button
                        aria-label={formatMessage(m.delete)}
                        variant="ghost"
                        size="small"
                        icon="trash"
                        colorScheme="destructive"
                        onClick={() => setDeleteTarget(translation)}
                      />
                    </Box>
                  </T.Data>
                </T.Row>
              ))}
            </T.Body>
          </T.Table>
        </Box>
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
        <TranslationConfirmModal
          target={deleteTarget}
          configuredEnvironments={configuredEnvironments}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </Stack>
  )
}

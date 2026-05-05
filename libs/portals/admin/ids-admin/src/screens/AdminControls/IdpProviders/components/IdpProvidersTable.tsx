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
import type { IdpProviderRow } from '../IdpProviders.types'
import { IdpProviderConfirmModal } from './IdpProviderConfirmModal'

interface IdpProvidersTableProps {
  rows: IdpProviderRow[]
  currentPage: number
  totalPages: number
  configuredEnvironments: AuthAdminEnvironment[]
  search?: string
  loading?: boolean
  onEdit: (idpProvider: IdpProviderRow) => void
  onDelete: (name: string, environments: AuthAdminEnvironment[]) => void
  onPageChange: (page: number) => void
  onClearSearch?: () => void
}

export const IdpProvidersTable = ({
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
}: IdpProvidersTableProps) => {
  const { formatMessage } = useLocale()

  const [deleteTarget, setDeleteTarget] = useState<IdpProviderRow | null>(null)

  const handleDeleteConfirm = (
    name: string,
    environments: AuthAdminEnvironment[],
  ) => {
    onDelete(name, environments)
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
                search ? m.noResultsForSearch : m.idpProvidersNoResults,
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
              <T.HeadData>{formatMessage(m.idpProvidersName)}</T.HeadData>
              <T.HeadData>
                {formatMessage(m.idpProvidersDescription)}
              </T.HeadData>
              <T.HeadData>{formatMessage(m.idpProvidersLevel)}</T.HeadData>
              <T.HeadData>
                {formatMessage(m.idpProvidersEnvironments)}
              </T.HeadData>
              <T.HeadData>{/* Actions */}</T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {rows.map((idpProvider) => (
              <T.Row key={idpProvider.name}>
                <T.Data>{idpProvider.name}</T.Data>
                <T.Data>{idpProvider.description}</T.Data>
                <T.Data>{idpProvider.level}</T.Data>
                <T.Data>
                  <Box display="flex" flexWrap="wrap" columnGap={1} rowGap={1}>
                    {idpProvider.availableEnvironments?.map((env) => (
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
                      onClick={() => onEdit(idpProvider)}
                    />
                    <Button
                      aria-label={formatMessage(m.delete)}
                      variant="ghost"
                      size="small"
                      icon="trash"
                      colorScheme="destructive"
                      onClick={() => setDeleteTarget(idpProvider)}
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
        <IdpProviderConfirmModal
          target={deleteTarget}
          configuredEnvironments={configuredEnvironments}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </Stack>
  )
}

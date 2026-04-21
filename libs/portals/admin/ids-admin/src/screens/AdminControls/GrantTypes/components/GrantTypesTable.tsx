import React, { useState } from 'react'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import {
  Box,
  Button,
  Pagination,
  Stack,
  Table as T,
  Tag,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'

import { m } from '../../../../lib/messages'
import type { GrantTypeRow } from '../GrantTypes.types'
import { GrantTypeConfirmModal } from './GrantTypeConfirmModal'

interface GrantTypesTableProps {
  rows: GrantTypeRow[]
  currentPage: number
  totalPages: number
  configuredEnvironments: AuthAdminEnvironment[]
  onEdit: (grantType: GrantTypeRow) => void
  onDelete: (name: string, environments: AuthAdminEnvironment[]) => void
  onRestore: (name: string, environments: AuthAdminEnvironment[]) => void
  onPageChange: (page: number) => void
}

export const GrantTypesTable = ({
  rows,
  currentPage,
  totalPages,
  configuredEnvironments,
  onEdit,
  onDelete,
  onRestore,
  onPageChange,
}: GrantTypesTableProps) => {
  const { formatMessage } = useLocale()

  const [deleteTarget, setDeleteTarget] = useState<GrantTypeRow | null>(null)
  const [restoreTarget, setRestoreTarget] = useState<GrantTypeRow | null>(null)

  const handleDeleteConfirm = (
    name: string,
    environments: AuthAdminEnvironment[],
  ) => {
    onDelete(name, environments)
    setDeleteTarget(null)
  }

  const handleRestoreConfirm = (
    name: string,
    environments: AuthAdminEnvironment[],
  ) => {
    onRestore(name, environments)
    setRestoreTarget(null)
  }

  if (rows.length === 0) {
    return (
      <Box
        padding={4}
        textAlign="center"
        border="standard"
        borderRadius="large"
      >
        <Problem
          type="no_data"
          title={formatMessage(m.grantTypesNoResults)}
          titleSize="h3"
        />
      </Box>
    )
  }

  return (
    <Stack space={3}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>{formatMessage(m.grantTypesName)}</T.HeadData>
            <T.HeadData>{formatMessage(m.grantTypesDescription)}</T.HeadData>
            <T.HeadData>{formatMessage(m.grantTypesEnvironments)}</T.HeadData>
            <T.HeadData>{/* Actions/Archived */}</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {rows.map((grantType) => {
            const isArchived = !!grantType.archived
            return (
              <T.Row key={grantType.name}>
                <T.Data>
                  <Box style={isArchived ? { opacity: 0.6 } : undefined}>
                    {grantType.name}
                  </Box>
                </T.Data>
                <T.Data>
                  <Box style={isArchived ? { opacity: 0.6 } : undefined}>
                    {grantType.description}
                  </Box>
                </T.Data>
                <T.Data>
                  <Box display="flex" flexWrap="wrap" columnGap={1} rowGap={1}>
                    {isArchived ? (
                      <Tag variant="red" outlined disabled>
                        {formatMessage(m.grantTypesArchived)}
                      </Tag>
                    ) : (
                      grantType.availableEnvironments?.map((env) => (
                        <Tag key={env} variant="blue" outlined disabled>
                          {env}
                        </Tag>
                      ))
                    )}
                  </Box>
                </T.Data>
                <T.Data>
                  {isArchived ? (
                    <Box display="flex" justifyContent="flexStart">
                      <Button
                        variant="ghost"
                        size="small"
                        icon="reload"
                        onClick={() => setRestoreTarget(grantType)}
                      />
                    </Box>
                  ) : (
                    <Box display="flex" columnGap={2} justifyContent="flexEnd">
                      <Button
                        variant="ghost"
                        size="small"
                        icon="pencil"
                        onClick={() => onEdit(grantType)}
                      />
                      <Button
                        variant="ghost"
                        size="small"
                        icon="trash"
                        colorScheme="destructive"
                        onClick={() => setDeleteTarget(grantType)}
                      />
                    </Box>
                  )}
                </T.Data>
              </T.Row>
            )
          })}
        </T.Body>
      </T.Table>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center">
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            renderLink={(page, className, children) => (
              <button className={className} onClick={() => onPageChange(page)}>
                {children}
              </button>
            )}
          />
        </Box>
      )}

      {deleteTarget && (
        <GrantTypeConfirmModal
          variant="delete"
          target={deleteTarget}
          configuredEnvironments={configuredEnvironments}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {restoreTarget && (
        <GrantTypeConfirmModal
          variant="restore"
          target={restoreTarget}
          configuredEnvironments={configuredEnvironments}
          onConfirm={handleRestoreConfirm}
          onClose={() => setRestoreTarget(null)}
        />
      )}
    </Stack>
  )
}

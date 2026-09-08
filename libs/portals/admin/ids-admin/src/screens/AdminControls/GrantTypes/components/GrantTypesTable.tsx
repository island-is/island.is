import { useState } from 'react'

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
import { authAdminEnvironments } from '../../../../utils/environments'
import { TableActionMenu } from '../../components/TableActionMenu'
import type { GrantTypeRow } from '../GrantTypes.types'
import { GrantTypeConfirmModal } from './GrantTypeConfirmModal'

interface GrantTypesTableProps {
  rows: GrantTypeRow[]
  currentPage: number
  totalPages: number
  configuredEnvironments: AuthAdminEnvironment[]
  search?: string
  loading?: boolean
  onEdit: (grantType: GrantTypeRow) => void
  onDelete: (name: string, environments: AuthAdminEnvironment[]) => void
  onRestore: (name: string, environments: AuthAdminEnvironment[]) => void
  onPageChange: (page: number) => void
  onClearSearch?: () => void
}

export const GrantTypesTable = ({
  rows,
  currentPage,
  totalPages,
  configuredEnvironments,
  search,
  loading,
  onEdit,
  onDelete,
  onRestore,
  onPageChange,
  onClearSearch,
}: GrantTypesTableProps) => {
  const { formatMessage } = useLocale()

  const [archiveTarget, setArchiveTarget] = useState<GrantTypeRow | null>(null)
  const [restoreTarget, setRestoreTarget] = useState<GrantTypeRow | null>(null)

  const handleArchiveConfirm = (
    name: string,
    environments: AuthAdminEnvironment[],
  ) => {
    onDelete(name, environments)
    setArchiveTarget(null)
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
        {loading ? (
          <LoadingDots />
        ) : (
          <Problem
            type="no_data"
            title={formatMessage(
              search ? m.noResultsForSearch : m.grantTypesNoResults,
            )}
            message={
              search && onClearSearch ? (
                <Box marginTop={2}>
                  <Button variant="ghost" size="small" onClick={onClearSearch}>
                    {formatMessage(m.clearFilter)}
                  </Button>
                </Box>
              ) : undefined
            }
            titleSize="h3"
          />
        )}
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
            <T.HeadData>{formatMessage(m.environments)}</T.HeadData>
            <T.HeadData>{/* Actions/Archived */}</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {rows.map((grantType) => {
            const archivedEnvs = grantType.archivedEnvironments ?? []
            const availableEnvs = grantType.availableEnvironments ?? []
            const activeEnvs = availableEnvs.filter(
              (e) => !archivedEnvs.includes(e),
            )
            const isFullyArchived =
              archivedEnvs.length > 0 &&
              archivedEnvs.length === availableEnvs.length

            return (
              <T.Row key={grantType.name}>
                <T.Data>
                  <Box style={isFullyArchived ? { opacity: 0.6 } : undefined}>
                    {grantType.name}
                  </Box>
                </T.Data>
                <T.Data>
                  <Box style={isFullyArchived ? { opacity: 0.6 } : undefined}>
                    {grantType.description}
                  </Box>
                </T.Data>
                <T.Data>
                  <Box display="flex" flexWrap="wrap" columnGap={1} rowGap={1}>
                    {authAdminEnvironments
                      .filter((env) => availableEnvs.includes(env))
                      .map((env) => {
                        const isArchived = archivedEnvs.includes(env)
                        return (
                          <Tag
                            key={env}
                            variant={isArchived ? 'disabled' : 'blue'}
                            outlined
                            disabled
                          >
                            {env}
                          </Tag>
                        )
                      })}
                  </Box>
                </T.Data>
                <T.Data>
                  <TableActionMenu
                    actions={[
                      {
                        show: !isFullyArchived,
                        title: m.edit,
                        icon: 'pencil',
                        onClick: () => onEdit(grantType),
                      },
                      {
                        show: archivedEnvs.length > 0,
                        title: m.restore,
                        icon: 'reload',
                        onClick: () => setRestoreTarget(grantType),
                      },
                      {
                        show: activeEnvs.length > 0,
                        title: m.archive,
                        icon: 'trash',
                        color: 'red600',
                        onClick: () => setArchiveTarget(grantType),
                      },
                    ]}
                  />
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

      {archiveTarget && (
        <GrantTypeConfirmModal
          variant="delete"
          target={archiveTarget}
          configuredEnvironments={configuredEnvironments}
          onConfirm={handleArchiveConfirm}
          onClose={() => setArchiveTarget(null)}
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

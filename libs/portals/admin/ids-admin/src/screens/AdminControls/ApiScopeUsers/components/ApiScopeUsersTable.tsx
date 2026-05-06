import React, { useState } from 'react'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import {
  Box,
  Button,
  Checkbox,
  InputError,
  LoadingDots,
  Pagination,
  Stack,
  Table as T,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'
import { Problem } from '@island.is/react-spa/shared'

import { m } from '../../../../lib/messages'
import { authAdminEnvironments } from '../../../../utils/environments'
import type { ApiScopeUserRow } from '../ApiScopeUsers.types'
import * as styles from '../ApiScopeUsers.css'

interface ApiScopeUsersTableProps {
  rows: ApiScopeUserRow[]
  currentPage: number
  totalPages: number
  configuredEnvironments: AuthAdminEnvironment[]
  search?: string
  loading?: boolean
  onEdit: (user: ApiScopeUserRow) => void
  onDelete: (nationalId: string, environments: AuthAdminEnvironment[]) => void
  onPageChange: (page: number) => void
  onClearSearch?: () => void
}

export const ApiScopeUsersTable = ({
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
}: ApiScopeUsersTableProps) => {
  const { formatMessage } = useLocale()

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ApiScopeUserRow | null>(null)
  const [deleteEnvironments, setDeleteEnvironments] = useState<
    AuthAdminEnvironment[]
  >([])
  const [deleteError, setDeleteError] = useState<string | undefined>(undefined)

  const openDeleteModal = (user: ApiScopeUserRow) => {
    setDeleteTarget(user)
    setDeleteEnvironments(user.availableEnvironments ?? [])
    setDeleteError(undefined)
    setDeleteModalVisible(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalVisible(false)
    setDeleteTarget(null)
    setDeleteEnvironments([])
    setDeleteError(undefined)
  }

  const handleDeleteEnvironmentChange = (env: AuthAdminEnvironment) => {
    setDeleteEnvironments((prev) =>
      prev.includes(env) ? prev.filter((e) => e !== env) : [...prev, env],
    )
    if (deleteError) {
      setDeleteError(undefined)
    }
  }

  const handleDeleteConfirm = () => {
    if (deleteEnvironments.length === 0) {
      setDeleteError(formatMessage(m.apiScopeUsersDeleteEnvironmentRequired))
      return
    }
    if (deleteTarget) {
      onDelete(deleteTarget.nationalId, deleteEnvironments)
      closeDeleteModal()
    }
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
              search ? m.noResultsForSearch : m.apiScopeUsersNoResults,
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
      <div className={styles.tableContainer}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>{formatMessage(m.apiScopeUsersName)}</T.HeadData>
              <T.HeadData>
                {formatMessage(m.apiScopeUsersNationalId)}
              </T.HeadData>
              <T.HeadData>{formatMessage(m.apiScopeUsersEmail)}</T.HeadData>
              <T.HeadData>{formatMessage(m.environments)}</T.HeadData>
              <T.HeadData>{/* Actions */}</T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {rows.map((user) => (
              <T.Row key={user.nationalId}>
                <T.Data>{user.name}</T.Data>
                <T.Data>{user.nationalId}</T.Data>
                <T.Data style={{ width: 180, wordBreak: 'break-all' }}>
                  {user.email}
                </T.Data>
                <T.Data>
                  <Box display="flex" flexWrap="wrap" columnGap={1} rowGap={1}>
                    {user.availableEnvironments?.map((env) => (
                      <Tag key={env} variant="blue" outlined disabled>
                        {env}
                      </Tag>
                    ))}
                  </Box>
                </T.Data>
                <T.Data>
                  <Box display="flex" columnGap={2} justifyContent="flexEnd">
                    <Button
                      variant="ghost"
                      size="small"
                      icon="pencil"
                      onClick={() => onEdit(user)}
                    />
                    <Button
                      variant="ghost"
                      size="small"
                      icon="trash"
                      colorScheme="destructive"
                      onClick={() => openDeleteModal(user)}
                    />
                  </Box>
                </T.Data>
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
      </div>

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

      {deleteModalVisible && deleteTarget && (
        <Modal
          id={`delete-${deleteTarget.nationalId}`}
          isVisible={deleteModalVisible}
          label={formatMessage(m.apiScopeUsersDeleteConfirmTitle)}
          onClose={closeDeleteModal}
          closeButtonLabel={formatMessage(m.cancel)}
          scrollType="outside"
        >
          <Box paddingX={4}>
            <Text variant="h2" as="h2" marginBottom={2}>
              {formatMessage(m.apiScopeUsersDeleteConfirmTitle)}
            </Text>
            <Text marginBottom={3}>
              {formatMessage(m.apiScopeUsersDeleteConfirmMessage)}
            </Text>

            <Box marginBottom={3}>
              <Text variant="h4" marginBottom={2}>
                {formatMessage(m.apiScopeUsersDeleteSelectEnvironments)}
              </Text>
              <Box
                display="flex"
                flexDirection={['column', 'row']}
                columnGap={3}
                rowGap={2}
              >
                {authAdminEnvironments.map((env) => {
                  const isUserEnv =
                    deleteTarget.availableEnvironments?.includes(env) ?? false
                  return (
                    <Box width="full" key={env}>
                      <Checkbox
                        label={env}
                        name="deleteEnvironments"
                        id={`deleteEnvironments.${env}`}
                        value={env}
                        checked={deleteEnvironments.includes(env)}
                        onChange={() => handleDeleteEnvironmentChange(env)}
                        disabled={
                          !isUserEnv || !configuredEnvironments.includes(env)
                        }
                        large
                      />
                    </Box>
                  )
                })}
              </Box>
              {deleteError && (
                <InputError
                  id="delete-environments-error"
                  errorMessage={deleteError}
                />
              )}
            </Box>

            <Box
              paddingTop={2}
              paddingBottom={4}
              display="flex"
              justifyContent="spaceBetween"
              columnGap={2}
            >
              <Button variant="ghost" onClick={closeDeleteModal}>
                {formatMessage(m.apiScopeUsersCancelButton)}
              </Button>
              <Button colorScheme="destructive" onClick={handleDeleteConfirm}>
                {formatMessage(m.apiScopeUsersDeleteButton)}
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Stack>
  )
}

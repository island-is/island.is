import React, { useState } from 'react'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import {
  Box,
  Button,
  Checkbox,
  InputError,
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
import type { GrantTypeRow } from '../GrantTypes.types'

interface GrantTypesTableProps {
  rows: GrantTypeRow[]
  currentPage: number
  totalPages: number
  configuredEnvironments: AuthAdminEnvironment[]
  onEdit: (grantType: GrantTypeRow) => void
  onDelete: (name: string, environments: AuthAdminEnvironment[]) => void
  onPageChange: (page: number) => void
}

export const GrantTypesTable = ({
  rows,
  currentPage,
  totalPages,
  configuredEnvironments,
  onEdit,
  onDelete,
  onPageChange,
}: GrantTypesTableProps) => {
  const { formatMessage } = useLocale()

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<GrantTypeRow | null>(null)
  const [deleteEnvironments, setDeleteEnvironments] = useState<
    AuthAdminEnvironment[]
  >([])
  const [deleteError, setDeleteError] = useState<string | undefined>(undefined)

  const openDeleteModal = (grantType: GrantTypeRow) => {
    setDeleteTarget(grantType)
    setDeleteEnvironments(grantType.availableEnvironments ?? [])
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
      setDeleteError(formatMessage(m.grantTypesDeleteEnvironmentRequired))
      return
    }
    if (deleteTarget) {
      onDelete(deleteTarget.name, deleteEnvironments)
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
                    {grantType.availableEnvironments?.map((env) => (
                      <Tag key={env} variant="blue" outlined>
                        {env}
                      </Tag>
                    ))}
                  </Box>
                </T.Data>
                <T.Data>
                  {isArchived ? (
                    <Tag variant="red" outlined>
                      {formatMessage(m.grantTypesArchived)}
                    </Tag>
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
                        onClick={() => openDeleteModal(grantType)}
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

      {deleteModalVisible && deleteTarget && (
        <Modal
          id={`delete-${deleteTarget.name}`}
          isVisible={deleteModalVisible}
          label={formatMessage(m.grantTypesDeleteConfirmTitle)}
          onClose={closeDeleteModal}
          closeButtonLabel={formatMessage(m.grantTypesCancelButton)}
          scrollType="outside"
        >
          <Box paddingX={4}>
            <Text variant="h2" as="h2" marginBottom={2}>
              {formatMessage(m.grantTypesDeleteConfirmTitle)}
            </Text>
            <Text marginBottom={3}>
              {formatMessage(m.grantTypesDeleteConfirmMessage)}
            </Text>

            <Box marginBottom={3}>
              <Text variant="h4" marginBottom={2}>
                {formatMessage(m.grantTypesDeleteSelectEnvironments)}
              </Text>
              <Box
                display="flex"
                flexDirection={['column', 'row']}
                columnGap={3}
                rowGap={2}
              >
                {authAdminEnvironments.map((env) => {
                  const isGrantTypeEnv =
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
                          !isGrantTypeEnv ||
                          !configuredEnvironments.includes(env)
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
                {formatMessage(m.grantTypesCancelButton)}
              </Button>
              <Button colorScheme="destructive" onClick={handleDeleteConfirm}>
                {formatMessage(m.grantTypesDeleteButton)}
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Stack>
  )
}

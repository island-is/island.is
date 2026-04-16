import React from 'react'

import {
  Box,
  Button,
  DialogPrompt,
  Pagination,
  Stack,
  Table as T,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'

import { m } from '../../../lib/messages'
import type { ApiScopeUserRow } from '../ApiScopeUsers.types'

interface ApiScopeUsersTableProps {
  rows: ApiScopeUserRow[]
  currentPage: number
  totalPages: number
  onEdit: (user: ApiScopeUserRow) => void
  onDelete: (nationalId: string) => void
  onPageChange: (page: number) => void
}

export const ApiScopeUsersTable = ({
  rows,
  currentPage,
  totalPages,
  onEdit,
  onDelete,
  onPageChange,
}: ApiScopeUsersTableProps) => {
  const { formatMessage } = useLocale()

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
          title={formatMessage(m.apiScopeUsersNoResults)}
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
            <T.HeadData>{formatMessage(m.apiScopeUsersName)}</T.HeadData>
            <T.HeadData>{formatMessage(m.apiScopeUsersNationalId)}</T.HeadData>
            <T.HeadData>{formatMessage(m.apiScopeUsersEmail)}</T.HeadData>
            <T.HeadData>{/* Actions */}</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {rows.map((user) => (
            <T.Row key={user.nationalId}>
              <T.Data>{user.name}</T.Data>
              <T.Data>{user.nationalId}</T.Data>
              <T.Data>{user.email}</T.Data>
              <T.Data>
                <Box display="flex" columnGap={2} justifyContent="flexEnd">
                  <Button
                    variant="ghost"
                    size="small"
                    icon="pencil"
                    onClick={() => onEdit(user)}
                  />
                  <DialogPrompt
                    baseId={`delete-${user.nationalId}`}
                    title={formatMessage(m.apiScopeUsersDeleteConfirmTitle)}
                    description={formatMessage(
                      m.apiScopeUsersDeleteConfirmMessage,
                    )}
                    ariaLabel={formatMessage(m.apiScopeUsersDeleteConfirmTitle)}
                    buttonTextConfirm={formatMessage(
                      m.apiScopeUsersDeleteButton,
                    )}
                    buttonPropsConfirm={{ colorScheme: 'destructive' }}
                    buttonTextCancel={formatMessage(
                      m.apiScopeUsersCancelButton,
                    )}
                    onConfirm={() => onDelete(user.nationalId)}
                    disclosureElement={
                      <Button
                        variant="ghost"
                        size="small"
                        icon="trash"
                        colorScheme="destructive"
                      />
                    }
                  />
                </Box>
              </T.Data>
            </T.Row>
          ))}
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
    </Stack>
  )
}

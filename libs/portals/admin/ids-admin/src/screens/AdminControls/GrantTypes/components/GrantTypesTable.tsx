import React from 'react'

import {
  Box,
  Button,
  DialogPrompt,
  Pagination,
  Stack,
  Table as T,
  Tag,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'

import { m } from '../../../../lib/messages'
import type { GrantTypeRow } from '../GrantTypes.types'

interface GrantTypesTableProps {
  rows: GrantTypeRow[]
  currentPage: number
  totalPages: number
  onEdit: (grantType: GrantTypeRow) => void
  onDelete: (name: string) => void
  onPageChange: (page: number) => void
}

export const GrantTypesTable = ({
  rows,
  currentPage,
  totalPages,
  onEdit,
  onDelete,
  onPageChange,
}: GrantTypesTableProps) => {
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
                      <DialogPrompt
                        baseId={`delete-${grantType.name}`}
                        title={formatMessage(m.grantTypesDeleteConfirmTitle)}
                        description={formatMessage(
                          m.grantTypesDeleteConfirmMessage,
                        )}
                        ariaLabel={formatMessage(
                          m.grantTypesDeleteConfirmTitle,
                        )}
                        buttonTextConfirm={formatMessage(
                          m.grantTypesDeleteButton,
                        )}
                        buttonPropsConfirm={{
                          colorScheme: 'destructive',
                          size: 'default',
                        }}
                        buttonPropsCancel={{
                          variant: 'ghost',
                          size: 'default',
                        }}
                        buttonTextCancel={formatMessage(
                          m.grantTypesCancelButton,
                        )}
                        onConfirm={() => onDelete(grantType.name)}
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
    </Stack>
  )
}

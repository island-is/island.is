import { useEffect, useState } from 'react'
import { Box, Pagination, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { formatDate, pageSize } from '../../lib/utils'
import { m } from '../../lib/messages'
import DropdownExport from './ExportPetition'
import { Endorsement, EndorsementList } from '@island.is/api/schema'
import { useGetPetitionEndorsementsPaginated } from '../hooks'
import {
  createColumnHelper,
  PortalTable,
} from '@island.is/portals/my-pages/core'

const PetitionsTable = (data: {
  canEdit: boolean
  listId: string
  petition?: EndorsementList
}) => {
  useNamespaces('sp.petitions')
  const { formatMessage } = useLocale()
  const [page, setPage] = useState(1)
  const [cursor, setCursor] = useState<string>('')
  const [pageDirection, setPageDirection] = useState<'before' | 'after' | ''>(
    '',
  )

  const { endorsements, loadingEndorsements, refetch } =
    useGetPetitionEndorsementsPaginated(data.listId, cursor, pageDirection)
  const columnHelper = createColumnHelper<Endorsement>()
  const columns = [
    columnHelper.accessor('created', {
      header: formatMessage(m.date),
      cell: ({ getValue }) => formatDate(getValue()),
      enableSorting: false,
    }),
    columnHelper.accessor((petition) => petition.meta.fullName, {
      id: 'name',
      header: formatMessage(m.name),
      cell: ({ getValue }) => getValue() || formatMessage(m.noName),
      enableSorting: false,
    }),
    ...(data.canEdit
      ? [
          columnHelper.accessor((petition) => petition.meta.locality, {
            id: 'locality',
            header: formatMessage(m.locality),
            cell: ({ getValue }) => getValue() || '',
            enableSorting: false,
          }),
        ]
      : []),
  ]

  useEffect(() => {
    refetch()
  }, [cursor, pageDirection])

  return (
    <Box>
      <Box display="flex" justifyContent="spaceBetween" marginBottom={2}>
        <Text variant="h3">{formatMessage(m.petitionsOverview)}</Text>
        <Box>{data.canEdit && <DropdownExport petitionId={data.listId} />}</Box>
      </Box>
      <Stack space={3}>
        <PortalTable
          columns={columns}
          data={endorsements.data ?? []}
          loading={loadingEndorsements}
          emptyMessage=""
          getRowId={(petition) => petition.id}
          mobileTitleKey="name"
        />

        {endorsements && !endorsements.data?.length && (
          <Text>{formatMessage(m.noSignatures)}</Text>
        )}
        {endorsements && endorsements.totalCount > pageSize && (
          <Pagination
            page={page}
            totalItems={endorsements.totalCount}
            itemsPerPage={pageSize}
            renderLink={(p, className, children) => (
              <Box
                cursor="pointer"
                className={className}
                component="button"
                onClick={() => {
                  setPage(p)
                  if (p > page && endorsements.pageInfo.hasNextPage) {
                    setPageDirection('after')
                    setCursor(endorsements.pageInfo.endCursor ?? '')
                  } else if (
                    p < page &&
                    endorsements.pageInfo.hasPreviousPage
                  ) {
                    setPageDirection('before')
                    setCursor(endorsements.pageInfo.startCursor ?? '')
                  }
                }}
              >
                {children}
              </Box>
            )}
          />
        )}
      </Stack>
    </Box>
  )
}

export default PetitionsTable

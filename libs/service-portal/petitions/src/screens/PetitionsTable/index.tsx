import { useEffect, useState } from 'react'
import {
  Box,
  Pagination,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { formatDate, pages, PAGE_SIZE, paginate } from '../../lib/utils'
import { m } from '../../lib/messages'
import DropdownExport from './ExportPetition'
import {
  Endorsement,
  EndorsementList,
  PaginatedEndorsementResponse,
} from '@island.is/api/schema'
import { getCSV } from './ExportPetition/downloadCSV'

const PetitionsTable = (data: {
  canEdit: boolean
  listId: string
  petition?: EndorsementList
  petitionSigners: PaginatedEndorsementResponse
}) => {
  useNamespaces('sp.petitions')
  const { formatMessage } = useLocale()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [petitionSigners, setPetitionSigners] = useState(
    data.petitionSigners?.data ?? [],
  )

  const handlePagination = (page: number, petitionSigners: Endorsement[]) => {
    setPage(page)
    setTotalPages(pages(petitionSigners?.length))
    setPetitionSigners(paginate(petitionSigners, PAGE_SIZE, page))
  }

  useEffect(() => {
    setPetitionSigners(data.petitionSigners?.data ?? [])
    handlePagination(1, data.petitionSigners?.data ?? [])
  }, [data])

  return (
    <Box>
      <Box display="flex" justifyContent="spaceBetween" marginBottom={2}>
        <Text variant="h3">{formatMessage(m.petitionsOverview)}</Text>
        <Box>
          {data.canEdit && (
            <DropdownExport
              petition={data.petition}
              petitionSigners={data.petitionSigners}
              petitionId={data.listId}
              onGetCSV={() => getCSV(data.petitionSigners, 'Undirskriftalisti')}
            />
          )}
        </Box>
      </Box>
      <Stack space={3}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>{formatMessage(m.date)}</T.HeadData>
              <T.HeadData>{formatMessage(m.name)}</T.HeadData>
              {data.canEdit && (
                <T.HeadData>{formatMessage(m.locality)}</T.HeadData>
              )}
            </T.Row>
          </T.Head>
          <T.Body>
            {petitionSigners?.map((petition: Endorsement) => {
              return (
                <T.Row key={petition.id}>
                  <T.Data text={{ variant: 'medium' }}>
                    {formatDate(petition.created)}
                  </T.Data>
                  <T.Data text={{ variant: 'medium' }}>
                    {petition.meta.fullName
                      ? petition.meta.fullName
                      : formatMessage(m.noName)}
                  </T.Data>
                  {data.canEdit && (
                    <T.Data text={{ variant: 'medium' }}>
                      {petition.meta.locality ? petition.meta.locality : ''}
                    </T.Data>
                  )}
                </T.Row>
              )
            })}
          </T.Body>
        </T.Table>

        {petitionSigners && !!petitionSigners.length ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            renderLink={(page, className, children) => (
              <Box
                cursor="pointer"
                className={className}
                onClick={() =>
                  handlePagination(page, data.petitionSigners?.data)
                }
              >
                {children}
              </Box>
            )}
          />
        ) : (
          <Text>{formatMessage(m.noSignatures)}</Text>
        )}
      </Stack>
    </Box>
  )
}

export default PetitionsTable

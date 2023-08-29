import { useEffect, useState } from 'react'
import {
  Box,
  Pagination,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatDate, pages, PAGE_SIZE, paginate } from '../../lib/utils/utils'
import { m } from '../../lib/messages'
import { ExportList } from '../ExportList'
import {
  Endorsement,
  EndorsementList,
  PaginatedEndorsementResponse,
} from '@island.is/api/schema'
import { getCSV } from '../ExportList/downloadCSV'

const ListSignersTable = (data: {
  listId: string
  petition: EndorsementList
  petitionSigners: PaginatedEndorsementResponse
}) => {
  const { formatMessage } = useLocale()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [listOfPetitions, setPetitions] = useState(
    data.petitionSigners?.data ?? [],
  )

  const handlePagination = (page: number, petitions: Endorsement[]) => {
    setPage(page)
    setTotalPages(pages(petitions?.length))
    setPetitions(paginate(petitions, PAGE_SIZE, page))
  }

  useEffect(() => {
    setPetitions(data.petitionSigners?.data ?? [])
    handlePagination(1, data.petitionSigners?.data ?? [])
  }, [data])

  return (
    <Box marginTop={12}>
      <Box display="flex" justifyContent="spaceBetween" marginBottom={3}>
        <Text variant="h3">{formatMessage(m.petitionsOverview)}</Text>
        <ExportList
          petition={data.petition}
          petitionSigners={data.petitionSigners}
          petitionId={data.listId}
          onGetCSV={() => getCSV(data.petitionSigners, 'Undirskriftalisti')}
        />
      </Box>
      <Stack space={3}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>{formatMessage(m.date)}</T.HeadData>
              <T.HeadData colSpan={2}>{formatMessage(m.name)}</T.HeadData>
              <T.HeadData></T.HeadData>
              <T.HeadData colSpan={2}>{formatMessage(m.locality)}</T.HeadData>
              <T.HeadData></T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {listOfPetitions?.map((petition: Endorsement) => {
              return (
                <T.Row key={petition.id}>
                  <T.Data text={{ variant: 'medium' }}>
                    {formatDate(petition.created)}
                  </T.Data>
                  <T.Data text={{ variant: 'medium' }} colSpan={2}>
                    {petition.meta.fullName
                      ? petition.meta.fullName
                      : formatMessage(m.noName)}
                  </T.Data>
                  <T.Data></T.Data>
                  <T.Data colSpan={2}>
                    {petition.meta.locality ? petition.meta.locality : ''}
                  </T.Data>
                  <T.Data></T.Data>
                </T.Row>
              )
            })}
          </T.Body>
        </T.Table>

        {listOfPetitions && !!listOfPetitions.length ? (
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

export default ListSignersTable

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
import DropdownExport, { getCSV } from './ExportPetition'

const PetitionsTable = (data: any) => {
  useNamespaces('sp.petitions')
  const { formatMessage } = useLocale()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [petitionSigners, setPetitionSigners] = useState(
    data.petitionSigners?.data ?? [],
  )

  const handlePagination = (page: number, petitions: any) => {
    setPage(page)
    setTotalPages(pages(petitions?.length))
    setPetitionSigners(paginate(petitions, PAGE_SIZE, page))
  }

  useEffect(() => {
    setPetitionSigners(data.petitionSigners?.data ?? [])
    handlePagination(1, data.petitionSigners?.data ?? [])
  }, [data])

  return (
    <Box>
      <Box display="flex" justifyContent="spaceBetween" marginBottom={2}>
        <Text variant="h3">{formatMessage(m.petitionsOverview)}</Text>
        {data.canEdit && (
          <DropdownExport
            petition={data.petition}
            petitionSigners={data.petitionSigners}
            petitionId={data.listId}
            onGetCSV={() => getCSV(petitionSigners, 'Undirskriftalisti')}
          />
        )}
      </Box>
      <Stack space={3}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>{formatMessage(m.date)}</T.HeadData>
              <T.HeadData colSpan={4}>{formatMessage(m.name)}</T.HeadData>
              <T.HeadData></T.HeadData>
              <T.HeadData></T.HeadData>
              <T.HeadData></T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {petitionSigners?.map((petition: any) => {
              return (
                <T.Row key={petition.id}>
                  <T.Data>{formatDate(petition.created)}</T.Data>
                  <T.Data colSpan={4}>
                    {petition.meta.fullName
                      ? petition.meta.fullName
                      : formatMessage(m.noName)}
                  </T.Data>
                  <T.Data></T.Data>
                  <T.Data></T.Data>
                  <T.Data></T.Data>
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

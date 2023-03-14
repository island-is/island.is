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
  const [listOfPetitions, setPetitions] = useState(data.petitions?.data ?? [])

  const handlePagination = (page: number, petitions: any) => {
    setPage(page)
    setTotalPages(pages(petitions?.length))
    setPetitions(paginate(petitions, PAGE_SIZE, page))
  }

  useEffect(() => {
    setPetitions(data.petitions?.data ?? [])
    handlePagination(1, data.petitions?.data ?? [])
  }, [data])

  return (
    <Box>
      <Box display="flex" justifyContent="spaceBetween" marginBottom={2}>
        <Text variant="h3">{formatMessage(m.petitionsOverview)}</Text>
        {data.canEdit && (
          <DropdownExport
            onGetCSV={() => getCSV(listOfPetitions, 'Undirskriftalisti')}
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
            {listOfPetitions?.map((petition: any) => {
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

        {listOfPetitions && !!listOfPetitions.length ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            renderLink={(page, className, children) => (
              <Box
                cursor="pointer"
                className={className}
                onClick={() => handlePagination(page, data.petitions?.data)}
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

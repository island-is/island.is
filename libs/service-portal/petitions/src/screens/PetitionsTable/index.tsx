import { useEffect, useState } from 'react'

import {
  Box,
  Button,
  Pagination,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'
import { ExportAsCSV } from '@island.is/shared/components'
import { formatDate, pages, PAGE_SIZE, paginate } from '../../lib/utils'

const PetitionsTable = (data: any) => {
  const { formatMessage } = useLocale()

  const mapToCSVFile = (petitions: any) => {
    return petitions.map((pet: any) => {
      return {
        Dagsetning: formatDate(pet.created),
        Nafn: pet.meta.fullName ? pet.meta.fullName : 'Nafn ekki skráð',
      }
    })
  }

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
        <Text variant="h3">{'Yfirlit meðmæla'}</Text>
        {data.isViewTypeEdit && (
          <Button variant="utility" icon="download" size="small">
            Sækja lista
          </Button>
        )}
      </Box>
      <Stack space={3}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>{'Dagsetning'}</T.HeadData>
              <T.HeadData colSpan={4}>{'Nafn'}</T.HeadData>
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
                      : 'Nafn ekki skráð'}
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
          <Text>{'no petitions'}</Text>
        )}
      </Stack>
    </Box>
  )
}

export default PetitionsTable

import { useEffect, useState } from 'react'

import {
  Box,
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
      <Box display="flex" justifyContent="spaceBetween">
        <Text variant="h3" marginBottom={2}>
          {'Yfirlit meðmæla'}
        </Text>
        {data.isViewTypeEdit && (
          <ExportAsCSV
            data={mapToCSVFile(data.petitions?.data) as object[]}
            filename="Meðmælalisti"
            title="Sækja lista"
            variant="text"
          />
        )}
      </Box>
      <Stack space={3}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData cols={4}>{'Dagsetning'}</T.HeadData>
              <T.HeadData>{'Nafn'}</T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {listOfPetitions?.map((petition: any) => {
              return (
                <T.Row key={petition.id}>
                  <T.Data cols={4}>{formatDate(petition.created)}</T.Data>
                  <T.Data>
                    {petition.meta.fullName
                      ? petition.meta.fullName
                      : 'Nafn ekki skráð'}
                  </T.Data>
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

import React, { useState, useEffect } from 'react'
import { Box, Table as T, Pagination, Stack } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { pages, PAGE_SIZE, paginate } from '../pagination'
import format from 'date-fns/format'
import { ExportAsCSV } from '@island.is/application/ui-components'

const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd.MM.yyyy')
  } catch {
    return date
  }
}

const PetitionsTable = (petitions: any) => {
  const { formatMessage } = useLocale()

  const mapToCSVFile = (petitions: any) => {
    return petitions.map((pet: any) => {
      return {
        Dagsetning: formatDate(pet.created),
        Nafn: pet.name ? pet.name : formatMessage(m.viewPetition.noNameLabel),
      }
    })
  }

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [listOfPetitions, setPetitions] = useState(
    petitions.petitions?.data ?? [],
  )

  const handlePagination = (page: number, petitions: any) => {
    setPage(page)
    setTotalPages(pages(petitions?.length))
    setPetitions(paginate(petitions, PAGE_SIZE, page))
  }

  useEffect(() => {
    handlePagination(1, petitions.petitions?.data ?? [])
  }, [petitions])

  return (
    <Box marginTop={2}>
      <Stack space={3}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>
                {formatMessage(m.viewPetition.dateSigned)}
              </T.HeadData>
              <T.HeadData>{formatMessage(m.viewPetition.name)}</T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {listOfPetitions?.map((petition: any) => {
              return (
                <T.Row key={petition.id}>
                  <T.Data>{formatDate(petition.created)}</T.Data>
                  <T.Data>
                    {petition.meta.fullName
                      ? petition.meta.fullName
                      : formatMessage(m.viewPetition.noNameLabel)}
                  </T.Data>
                </T.Row>
              )
            })}
          </T.Body>
        </T.Table>

        {listOfPetitions && !!listOfPetitions.length && (
          <Pagination
            page={page}
            totalPages={totalPages}
            renderLink={(page, className, children) => (
              <Box
                cursor="pointer"
                className={className}
                onClick={() => handlePagination(page, listOfPetitions)}
              >
                {children}
              </Box>
            )}
          />
        )}

        {listOfPetitions?.length > 0 && (
          <Box display="flex" justifyContent="flexEnd" marginTop={2}>
            <ExportAsCSV
              data={mapToCSVFile(listOfPetitions) as object[]}
              filename="Meðmælalisti"
              title="Sækja lista"
              variant="text"
            />
          </Box>
        )}
      </Stack>
    </Box>
  )
}

export default PetitionsTable

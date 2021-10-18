import React, { useState, useEffect } from 'react'
import { Box, Table as T, Pagination, Stack } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { list } from '../mocks'
import { pages, PAGE_SIZE, paginate } from '../pagination'

const PetitionsTable = () => {
  const { formatMessage } = useLocale()

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [pagePetitions, setPetitions] = useState(list.signedPetitions)

  const handlePagination = (page: number, petitions: any) => {
    setPage(page)
    setTotalPages(pages(petitions?.length))
    setPetitions(paginate(petitions, PAGE_SIZE, page))
  }

  useEffect(() => {
    handlePagination(1, list.signedPetitions)
  }, [])

  return (
    <Stack space={3}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>{formatMessage(m.viewPetition.dateSigned)}</T.HeadData>
            <T.HeadData>{formatMessage(m.viewPetition.name)}</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {pagePetitions.map((petition) => {
            return (
              <T.Row key={petition.kt}>
                <T.Data>{petition.signed}</T.Data>
                <T.Data>{petition.name}</T.Data>
              </T.Row>
            )
          })}
        </T.Body>
      </T.Table>

      {!!list.signedPetitions?.length && (
        <Pagination
          page={page}
          totalPages={totalPages}
          renderLink={(page, className, children) => (
            <Box
              cursor="pointer"
              className={className}
              onClick={() => handlePagination(page, list.signedPetitions)}
            >
              {children}
            </Box>
          )}
        />
      )}
    </Stack>
  )
}

export default PetitionsTable

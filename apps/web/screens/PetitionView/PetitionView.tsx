import React, { useState, useEffect } from 'react'
import { Text } from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  Button,
  Table as T,
  Pagination,
} from '@island.is/island-ui/core'
import { PAGE_SIZE, pages, paginate } from './pagination'
import format from 'date-fns/format'
import { useRouter } from 'next/router'
import { useGetPetitionList, useGetPetitionListEndorsements } from './queries'

const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd.MM.yyyy')
  } catch {
    return date
  }
}

const PetitionView = () => {
  const router = useRouter()

  const list = useGetPetitionList(router.query.slug as string)
  const listEndorsements = useGetPetitionListEndorsements(
    router.query.slug as string,
  )

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [pagePetitions, setPetitions] = useState(listEndorsements.data)

  const getBaseUrl = () => {
    const isLocalhost = window?.location.origin.includes('localhost')
    const isDev = window?.location.origin.includes('beta.dev01.devland.is')
    const isStaging = window?.location.origin.includes(
      'beta.staging01.devland.is',
    )

    const baseUrlForm = isLocalhost
      ? 'http://localhost:4242/umsoknir'
      : isDev
      ? 'https://beta.dev01.devland.is/umsoknir'
      : isStaging
      ? 'https://beta.staging01.devland.is/umsoknir'
      : 'https://island.is/umsoknir'

    return baseUrlForm
  }

  const handlePagination = (page, petitions) => {
    setPage(page)
    setTotalPages(pages(petitions?.length))
    setPetitions(paginate(petitions, PAGE_SIZE, page))
  }

  useEffect(() => {
    handlePagination(1, listEndorsements.data)
    setPetitions(listEndorsements.data)
  }, [listEndorsements])

  return (
    <Box marginTop={5} marginBottom={5}>
      <GridContainer>
        <GridRow>
          <GridColumn span="10/12" offset="1/12">
            <GridRow>
              <GridColumn>
                <Text variant="h2" marginBottom={3}>
                  {list.title}
                </Text>
                <Text variant="default" marginBottom={3}>
                  {list.description}
                </Text>
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span={['12/12', '4/12', '4/12']}>
                <Text variant="h4">Meðmælendalistinn er opinn til:</Text>
                <Text variant="default">{formatDate(list.closedDate)}</Text>
              </GridColumn>
              <GridColumn span={['12/12', '4/12', '4/12']}>
                <Text variant="h4">Ábyrgðarmaður:</Text>
                <Text variant="default">{list.ownerName}</Text>
              </GridColumn>
              <GridColumn span={['12/12', '4/12', '4/12']}>
                <Text variant="h4">Fjöldi skráðir:</Text>
                <Text variant="default">{listEndorsements.totalCount}</Text>
              </GridColumn>
            </GridRow>
            <GridRow marginTop={5}>
              <GridColumn span={['12/12', '6/12', '6/12']}>
                <Button
                  variant="primary"
                  icon="arrowForward"
                  onClick={() =>
                    window?.open(
                      `${getBaseUrl()}/medmaelendalisti/${
                        list.meta.applicationId
                      }`,
                    )
                  }
                >
                  Setja nafn mitt á þennan lista
                </Button>
              </GridColumn>
            </GridRow>
            <GridRow marginTop={5} marginBottom={5}>
              <GridColumn span={['12/12', '12/12', '12/12']}>
                <T.Table>
                  <T.Head>
                    <T.Row>
                      <T.HeadData>Dags skráð</T.HeadData>
                      <T.HeadData>Nafn</T.HeadData>
                    </T.Row>
                  </T.Head>
                  <T.Body>
                    {pagePetitions?.map((petition) => {
                      return (
                        <T.Row key={petition.id}>
                          <T.Data>{formatDate(list.created)}</T.Data>
                          <T.Data>
                            {petition.meta.fullName ?? 'Nafn ótilgreint'}
                          </T.Data>
                        </T.Row>
                      )
                    })}
                  </T.Body>
                </T.Table>
              </GridColumn>
            </GridRow>
            {!!list.signedPetitions?.length && (
              <Box marginY={3}>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  renderLink={(page, className, children) => (
                    <Box
                      cursor="pointer"
                      className={className}
                      onClick={() =>
                        handlePagination(page, list.signedPetitions)
                      }
                    >
                      {children}
                    </Box>
                  )}
                />
              </Box>
            )}
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default withMainLayout(PetitionView)

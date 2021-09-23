import React, { useState, useEffect } from 'react'
import { Text, DatePicker } from '@island.is/island-ui/core'
import { Box, Button, Table as T, Pagination } from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'
import { ExportAsCSV } from '@island.is/application/ui-components'
import { useGetSinglePetition, useUnendorseList } from '../queries'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { Link } from 'react-router-dom'
import { pages, PAGE_SIZE, paginate } from './pagination'

export const list = {
  petitions: 256,
  til: '05.08.2021',
  owner: 'Daði',
  onPaper: 'nei',
  signedPetitions: [
    {
      kt: 1,
      signed: '23.01.2021',
      name: 'Jón Þór Sigurðsson',
    },
    {
      kt: 2,
      signed: '23.01.2021',
      name: 'Elín Eddudóttir',
    },
    {
      kt: 3,
      signed: '23.01.2021',
      name: 'Ari Jónsson	',
    },
    {
      kt: 4,
      signed: '23.01.2021',
      name: 'Anita Valgeirs',
    },
  ],
}

const mapToCSVFile = (petitions: any) => {
  return petitions.map((pet: any) => {
    return {
      Dagsetning: new Date(pet.signed),
      Nafn: pet.name,
    }
  })
}

const ViewPetition = () => {
  const location: any = useLocation()
  const petition = useGetSinglePetition(location.state?.listId)
  const viewTypeEdit = location.state?.type === 'edit'
  
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [pagePetitions, setPetitions] = useState(list.signedPetitions)
  
  const [unendorseList] = useUnendorseList()
  
  const handlePagination = (page: number, petitions: any) => {
    setPage(page)
    setTotalPages(pages(petitions?.length))
    setPetitions(paginate(petitions, PAGE_SIZE, page))
  }

  useEffect(() => {
    handlePagination(1, list.signedPetitions)
  }, [])

  return (
    <Box>
      <Text variant="h2" marginBottom={3}>
        {petition?.title}
      </Text>
      <Text variant="default" marginBottom={3}>
        {petition?.description}
      </Text>

      <Box
        marginBottom={5}
        display="flex"
        justifyContent="spaceBetween"
        width={viewTypeEdit ? 'half' : 'full'}
      >
        {!viewTypeEdit && (
          <>
            <Box>
              <Text variant="h4">Undirskriftalistinn er opinn:</Text>
              <Text variant="default" marginBottom={3}>
                {list.til}
              </Text>
            </Box>

            <Box>
              <Text variant="h4">Ábyrgðarmaður:</Text>
              <Text variant="default" marginBottom={3}>
                {list.owner}
              </Text>
            </Box>
          </>
        )}

        <Box>
          <Text variant="h4">Fjöldi skráðir:</Text>
          <Text variant="default" marginBottom={3}>
            {list.signedPetitions.length}
          </Text>
        </Box>
      </Box>

      {!viewTypeEdit && (
        <Box marginBottom={5}>
          <Link
            style={{ textDecoration: 'none' }}
            key={petition?.id}
            to={ServicePortalPath.Petitions}
          >
            <Button
              variant="primary"
              icon="close"
              onClick={() =>
                unendorseList({
                  variables: {
                    input: { listId: location.state?.listId },
                  },
                })
              }
            >
              Taka nafn mitt af þessum lista
            </Button>
          </Link>
        </Box>
      )}

      {location.state.type === 'edit' && (
        <Box width="half">
          <DatePicker
            //handleChange={function noRefCheck(){}}
            label="Breyta loka dagsetningu"
            locale="is"
            placeholderText="Veldu dagsetningu"
          />
          <Box
            display="flex"
            justifyContent="spaceBetween"
            marginTop={5}
            marginBottom={5}
          >
            <Button icon="close" iconType="outline" colorScheme="destructive">
              Loka lista
            </Button>
            <ExportAsCSV
              data={mapToCSVFile(list.signedPetitions) as object[]}
              filename="Meðmælalisti"
              title="Sækja lista"
              variant="ghost"
            />
          </Box>
        </Box>
      )}

      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>Dags skráð</T.HeadData>
            <T.HeadData>Nafn</T.HeadData>
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
        <Box marginY={3}>
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
        </Box>
      )}
    </Box>
  )
}

export default ViewPetition

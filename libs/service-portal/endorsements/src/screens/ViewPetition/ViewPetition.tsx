import React, { useState, useEffect } from 'react'
import { Text, DatePicker } from '@island.is/island-ui/core'
import { Box, Button, Table as T, Pagination, toast, DialogPrompt } from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'
import { ExportAsCSV } from '@island.is/application/ui-components'
import { useGetSinglePetition, UnendorseList, EndorseList } from '../queries'
import { pages, PAGE_SIZE, paginate } from './pagination'
import { useMutation } from '@apollo/client'

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

  const [unendorseList, { loading: isLoading }] = useMutation(UnendorseList)
  const [createEndorsement, { loading: submitLoad }] = useMutation(EndorseList)
  
  const handlePagination = (page: number, petitions: any) => {
    setPage(page)
    setTotalPages(pages(petitions?.length))
    setPetitions(paginate(petitions, PAGE_SIZE, page))
  }

  useEffect(() => {
    handlePagination(1, list.signedPetitions)
  }, [])

  const onUnendorse = async () => {
    const success = await unendorseList({
      variables: {
        input: {
          listId: location.state?.listId ,
        },
      },
    }).catch(() => {
      toast.error('error! semja texta hér')
    })

    if (success) {
      toast.success('DONE')
    }
  }

  const onEndorse = async () => {
    const success = await createEndorsement({
      variables: {
        input: {
          listId: location.state?.listId ,
        },
      },
    }).catch(() => {
      toast.error('error! semja texta hér')
    })

    if (success) {
      toast.success('DONE')
    }
  }

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
        <>
          <Box marginBottom={5} width='half'>
            <DialogPrompt
              baseId="demo_dialog"
              title="Ertu viss um að vilja taka nafn þitt af lista?"
              ariaLabel="modal to confirm that user is willing to close the petition list"
              disclosureElement={
                <Button
                  loading={isLoading}
                  variant="primary"
                  icon="close"
                  //onClick={() => onUnendorse()}
                >
                  {/*<Link
                    style={{ textDecoration: 'none' }}
                    key={petition?.id}
                    to={ServicePortalPath.Petitions}
                  >*/}
                    Taka nafn mitt af þessum lista
                  
                </Button>
              }
              onConfirm={() => console.log('Confirmed')}
              onCancel={() => console.log('Cancelled')}
              buttonTextConfirm="Já"
              buttonTextCancel="Hætta við"
            />
          </Box>
          <Box marginBottom={5} width='half'>
            <Button
              loading={submitLoad}
              variant="primary"
              icon="arrowForward"
              onClick={() => onEndorse()}
            >
            {/*<Link
              style={{ textDecoration: 'none' }}
              key={petition?.id}
              to={ServicePortalPath.Petitions}
            >*/}
              Setja nafn mitt á lista
            
            </Button>
          </Box>
        </>
      )}

      {location.state.type === 'edit' && (
        <Box>
          <Box width="half">
            <DatePicker
              label="Breyta loka dagsetningu"
              locale="is"
              placeholderText="Veldu dagsetningu"
            />
          </Box>
          <Box
            display="flex"
            marginTop={5}
            marginBottom={5}
          >
            <DialogPrompt
              baseId="demo_dialog"
              title="Ertu viss um að vilja loka lista?"
              ariaLabel="modal to confirm that user is willing to close the petition list"
              disclosureElement={
                <Button icon='lockClosed' iconType="outline" colorScheme="destructive">
                  Loka lista
                </Button>
              }
              onConfirm={() => console.log('Confirmed')}
              onCancel={() => console.log('Cancelled')}
              buttonTextConfirm="Já"
              buttonTextCancel="Hætta við"
            />
            
            <Box marginLeft={3} marginRight={3}>
              <ExportAsCSV
                data={mapToCSVFile(list.signedPetitions) as object[]}
                filename="Meðmælalisti"
                title="Sækja lista"
                variant="ghost"
              />
            </Box>
            <Button icon='mail' iconType="outline" variant='ghost'>
              Senda lista
            </Button>
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

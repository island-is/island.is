import React, { useState, useEffect } from 'react'
import { DatePicker } from '@island.is/island-ui/core'
import {
  Box,
  Button,
  Table as T,
  Pagination,
  Input,
  Stack,
  DialogPrompt,
} from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'
import { ExportAsCSV } from '@island.is/application/ui-components'
import { useGetSinglePetition } from '../queries'
import { pages, PAGE_SIZE, paginate } from './pagination'
import { list } from '../mocks'

const mapToCSVFile = (petitions: any) => {
  return petitions.map((pet: any) => {
    return {
      Dagsetning: new Date(pet.signed),
      Nafn: pet.name,
    }
  })
}

const ViewPetitionAdmin = () => {
  const location: any = useLocation()
  const petition = useGetSinglePetition(location.state?.listId)

  const [title, setTitle] = useState(petition?.title)
  const [description, setDescription] = useState(petition?.description)

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

    setTitle(petition?.title)
    setDescription(
      'Við undirrituð mótmælum þeirri ákvörðun ríkisstjórnarinnar að setja alla sem til Íslands koma í sóttkví og viðbótarskimun, burtséð frá því hvort fólk er smitað eða ekki. Í sumar hafa minna en 0.1% ferðamanna reynst smitaðir. Seinni skimun mun því litlu við bæta en mun aftur á móti valda óásættanlegum skaða. Aðgerðin mun orsaka atvinnuleysi tugþúsunda Íslendinga með tilheyrandi efnahagslegum hamförum af mannavöldum. Við krefjumst því þess að yfirvöld falli frá þessari skaðlegu stefnu og beiti aðeins sóttvarnaraðgerðum sem hægt er að viðhalda til langs tíma án þess að valda óbætanlegu samfélagstjóni.',
    )
  }, [petition])

  return (
    <Box>
      <Stack space={3}>
        <Input
          name={title as string}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
          }}
          label={'Heiti meðmælendalista'}
        />
        <Input
          name={description as string}
          value={description as string}
          onChange={(e) => {
            setDescription(e.target.value)
          }}
          label={'Um meðmælendalista'}
          textarea
          rows={10}
        />
        <Box display="flex" justifyContent="spaceBetween">
          <Box width="half" marginRight={2}>
            <DatePicker
              selected={new Date()}
              handleChange={(date: Date) => console.log(date)}
              label="Tímabil frá"
              locale="is"
              placeholderText="Veldu dagsetningu"
            />
          </Box>
          <Box width="half" marginLeft={2}>
            <DatePicker
              selected={new Date()}
              handleChange={(date: Date) => console.log(date)}
              label="Tímabil til"
              locale="is"
              placeholderText="Veldu dagsetningu"
            />
          </Box>
        </Box>

        <Input
          name={list.owner}
          value={list.owner}
          onChange={(e) => {
            //setTitle(e.target.value)
          }}
          label={'Ábyrgðamaður'}
        />

        <Box
          display="flex"
          justifyContent="spaceBetween"
          marginTop={5}
          marginBottom={5}
        >
          <DialogPrompt
            baseId="demo_dialog"
            title="Ertu viss um að vilja loka lista?"
            ariaLabel="modal to confirm that user is willing to close the petition list"
            disclosureElement={
              <Button
                icon="lockClosed"
                iconType="outline"
                colorScheme="destructive"
              >
                Loka lista
              </Button>
            }
            onConfirm={() => console.log('Confirmed')}
            onCancel={() => console.log('Cancelled')}
            buttonTextConfirm="Já"
            buttonTextCancel="Hætta við"
          />
          <Button icon="reload" iconType="outline">
            Uppfæra lista
          </Button>
        </Box>

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

        <ExportAsCSV
          data={mapToCSVFile(list.signedPetitions) as object[]}
          filename="Meðmælalisti"
          title="Sækja lista"
          variant="ghost"
        />
      </Stack>
    </Box>
  )
}

export default ViewPetitionAdmin

import React from 'react'
import { Text } from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  Button,
  Table as T,
} from '@island.is/island-ui/core'

const list = {
  id: 1,
  title: 'Jafn atkvæðisréttur er sanngirnismál',
  descritptionText: 'Við undirrituð mótmælum þeirri ákvörðun ríkisstjórnarinnar að setja alla sem til Íslands koma í sóttkví og viðbótarskimun, burtséð frá því hvort fólk er smitað eða ekki. Í sumar hafa minna en 0.1% ferðamanna reynst smitaðir. Seinni skimun mun því litlu við bæta en mun aftur á móti valda óásættanlegum skaða. Aðgerðin mun orsaka atvinnuleysi tugþúsunda Íslendinga með tilheyrandi efnahagslegum hamförum af mannavöldum. Við krefjumst því þess að yfirvöld falli frá þessari skaðlegu stefnu og beiti aðeins sóttvarnaraðgerðum sem hægt er að viðhalda til langs tíma án þess að valda óbætanlegu samfélagstjóni.',
  petitions:  256,
  til: '05.08.2021',
  owner: 'Jóhannes Loftsson',
  onPaper: 'nei',
  signedPetitions: [
    {
      signed: '23.01.2021',
      name: 'Jón Þór Sigurðsson',
      athugasemd: 'Djöfull er ég pepp'
    },
    {
      signed: '23.01.2021',
      name: 'Elín Eddudóttir',
      athugasemd: 'Eins gott!'
    },
    {
      signed: '23.01.2021',
      name: 'Ari Jónsson	',
      athugasemd: ''
    },
    {
      signed: '23.01.2021',
      name: 'Jón Þór Sigurðsson',
      athugasemd: 'Djöfull er ég pepp'
    },
    {
      signed: '23.01.2021',
      name: 'Elín Eddudóttir',
      athugasemd: 'Eins gott!'
    },
    {
      signed: '23.01.2021',
      name: 'Ari Jónsson	',
      athugasemd: ''
    }
  ]
}

const Undirskriftalistar = () => {
  return (
    <Box>
      <GridContainer>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '12/12']}>
              <Text variant='h2' marginBottom={3}>{list.title}</Text>
              <Text variant='default' marginBottom={3}>{list.descritptionText}</Text>
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['6/12', '6/12', '6/12']}>
              <Text variant='h4'>Undirskriftalistinn er opinn:</Text>
              <Text variant='default'>{list.til}</Text>
              <Text variant='h4' marginTop={3}>Ábyrgðarmaður:</Text>
              <Text variant='default'>{list.owner}</Text>
            </GridColumn>
            <GridColumn span={['6/12', '6/12', '6/12']}>
              <Text variant='h4' marginTop={3}>Á pappir:</Text>
              <Text variant='default'>{list.onPaper}</Text>
            </GridColumn>
          </GridRow>
          <GridRow marginTop={5}>
            <GridColumn span={['6/12', '6/12', '6/12']}>
              <Button variant='text' icon='arrowForward'>Setja nafn mitt á þennan lista</Button>
            </GridColumn>
            <GridColumn span={['6/12', '6/12', '6/12']}>
              <Text variant='h4'>{list.signedPetitions.length} hafa skráð sig á listann</Text>
            </GridColumn>
          </GridRow>
          <GridRow marginTop={5} marginBottom={5}>
            <GridColumn span={['12/12', '12/12', '12/12']}>
              <T.Table>
                <T.Head>
                  <T.Row>
                    <T.HeadData>Dags skráð</T.HeadData>
                    <T.HeadData>Nafn</T.HeadData>
                    <T.HeadData>Athugasemd</T.HeadData>
                  </T.Row>
                </T.Head>
                <T.Body>
                  {list.signedPetitions.map((petition) => {
                    return (
                      <T.Row key={list.id}>
                        <T.Data>{petition.signed}</T.Data>
                        <T.Data>{petition.name}</T.Data>
                        <T.Data>{petition.athugasemd}</T.Data>
                      </T.Row>
                    )
                  })}
                </T.Body>
              </T.Table>
            </GridColumn>
          </GridRow>
      </GridContainer>
    </Box>
  )
}

export default withMainLayout(Undirskriftalistar)

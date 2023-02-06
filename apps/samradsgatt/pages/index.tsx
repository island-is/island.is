import {
  AsyncSearch,
  AsyncSearchOption,
  Column,
  Columns,
  GridColumn,
  GridContainer,
  GridRow,
  Tiles,
} from '@island.is/island-ui/core'
import React, { useEffect, useState } from 'react'
import Card from '../components/Card/Card'
import Layout from '../components/Layout/Layout'
type arrayDummy = Array<info>
type info = {
  caseNumber: string
  status: string
  id: number
  name: string
  adviceCount: number
  shortDescription: string
  institution: string
  policyArea: string
  type: string
  processBegins: string
  processEnds: string
  created: string
}
export const Index = () => {
  const dummycontent: arrayDummy = [
    {
      id: 3027,
      caseNumber: '3/2023',
      name: 'Númer 3 TESTE',
      adviceCount: 22,
      shortDescription: 'test',
      status: 'Til umsagnar',
      institution: 'Fjármála- og efnahagsráðuneytið',
      type: 'Drög að stefnu',
      policyArea: 'Fjölmiðlun',
      processBegins: '2023-01-13T00:00:00',
      processEnds: '2023-01-27T23:59:59',
      created: '2023-01-13T15:46:27.82',
    },
    {
      id: 3025,
      caseNumber: '1/2023',
      name: 'test birting máls 2',
      adviceCount: 0,
      shortDescription: '',
      status: 'Til umsagnar',
      institution: 'Fjármála- og efnahagsráðuneytið',
      type: 'Drög að reglugerð',
      policyArea: 'Framhaldsskólastig',
      processBegins: '2023-01-10T00:00:00',
      processEnds: '2023-01-10T23:59:59',
      created: '2023-01-10T15:48:35.207',
    },
    {
      id: 3019,
      caseNumber: '10/2022',
      name: 'Prufa birting',
      adviceCount: 1,
      shortDescription: 'Gaman',
      status: 'Niðurstöður birtar',
      institution: 'Félags- og vinnumarkaðsráðuneytið',
      type: 'Drög að stefnu',
      policyArea: 'Alþingi og eftirlitsstofnanir þess',
      processBegins: '2022-10-04T00:00:00',
      processEnds: '2023-01-10T23:59:59',
      created: '2022-10-07T15:51:21.59',
    },
    {
      id: 3017,
      caseNumber: '8/2022',
      name: 'Prufa 4. maí -  Aukið öryggi á vegum',
      adviceCount: 1,
      shortDescription: '',
      status: 'Niðurstöður í vinnslu',
      institution: 'Innviðaráðuneytið',
      type: 'Drög að reglugerð',
      policyArea: 'Samgöngu- og fjarskiptamál',
      processBegins: '2022-05-04T00:00:00',
      processEnds: '2022-05-18T23:59:59',
      created: '2022-05-04T11:12:59.877',
    },
    {
      id: 3013,
      caseNumber: '4/2022',
      name: 'Drög að stefnu og aðgerðaráætlun um orkuskipti í flugi',
      adviceCount: 0,
      shortDescription:
        'Innviðaráðuneytið kynnir til umsagnar drög að stefnu og aðgerðaráætlun um orkuskipti í flugi á Íslandi.',
      status: 'Til umsagnar',
      institution: 'Innviðaráðuneytið',
      type: 'Drög að stefnu',
      policyArea: 'Samgöngu- og fjarskiptamál',
      processBegins: '2022-04-26T00:00:00',
      processEnds: '2022-05-17T23:59:59',
      created: '2022-04-26T16:47:03.447',
    },
    {
      id: 3016,
      caseNumber: '7/2022',
      name: 'TEST',
      adviceCount: 0,
      shortDescription: '',
      status: 'Samráð fyrirhugað',
      institution: 'Dómsmálaráðuneytið',
      type: 'Áform um lagasetningu',
      policyArea: 'Dómstólar',
      processBegins: '2022-04-28T00:00:00',
      processEnds: '2022-04-28T23:59:59',
      created: '2022-04-27T16:35:32.923',
    },
    {
      id: 3012,
      caseNumber: '3/2022',
      name: 'Aukið öryggi á vegum',
      adviceCount: 0,
      shortDescription:
        'Innviðaráðuneytið hefur undanfarið unnið að setningu reglna um sjálfstætt eftirlit með öryggi vegamannvirkja og birtir nú til umsagnar drög að reglugerð um breytingu á reglugerð nr. 866/2011',
      status: 'Til umsagnar',
      institution: 'Innviðaráðuneytið',
      type: 'Drög að reglugerð',
      policyArea: 'Samgöngu- og fjarskiptamál',
      processBegins: '2022-04-18T00:00:00',
      processEnds: '2022-05-02T23:59:59',
      created: '2022-04-26T16:26:59.167',
    },
    {
      id: 3011,
      caseNumber: '2/2022',
      name: 'Test á nafni stofnunar',
      adviceCount: 0,
      shortDescription: 'test',
      status: 'Niðurstöður birtar',
      institution: 'Utanríkisráðuneytið',
      type: 'Áform um lagasetningu',
      policyArea: 'Landbúnaður',
      processBegins: '2022-02-21T00:00:00',
      processEnds: '2022-02-26T23:59:59',
      created: '2022-02-24T10:16:32.093',
    },
  ]
  const [searchValue, setSearchValue] = useState<string>('')
  const [prevSearchValue, setPrevSearchValue] = useState<string>('')
  const [data, setData] = useState(dummycontent)
  const [options, setOptions] = useState<AsyncSearchOption[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const clearAll = () => {
    setIsLoading(false)
    setOptions([])
    setData(dummycontent)
  }
  useEffect(() => {
    if (!searchValue) {
      clearAll()
    } else if (searchValue != prevSearchValue) {
      const filtered = dummycontent.filter(
        (item) =>
          item.name.includes(searchValue) ||
          item.caseNumber.includes(searchValue) ||
          item.institution.includes(searchValue),
      )
      setData(filtered)
      setPrevSearchValue(searchValue)
    }
  }, [searchValue])

  return (
    <Layout showIcon={false}>
      <GridContainer>
        <GridRow>
          <GridColumn span="12/12" paddingBottom={4} paddingTop={4}>
            <Columns space={3} alignY="center">
              <Column>
                <AsyncSearch
                  options={options}
                  placeholder="Að hverju ertu að leita?"
                  initialInputValue=""
                  inputValue={searchValue}
                  onInputValueChange={(value) => {
                    setSearchValue(value)
                  }}
                />
              </Column>
              <Column>
                <div></div>
              </Column>
            </Columns>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['0', '0', '3/12', '3/12', '3/12']}></GridColumn>
          <GridColumn span={['12/12', '12/12', '9/12', '9/12', '9/12']}>
            {data && (
              <Tiles space={3} columns={[1, 1, 1, 2, 3]}>
                {data.map((item, index) => {
                  return <Card key={index} {...item} />
                })}
              </Tiles>
            )}
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Layout>
  )
}

export default Index

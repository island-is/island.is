import {
  AsyncSearch,
  AsyncSearchOption,
  GridColumn,
  GridRow,
  Tiles,
} from '@island.is/island-ui/core'
import React, { useEffect, useState } from 'react'
import Card from '../components/Card/Card'
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
      id: 0,
      caseNumber: 'NR.S-76/2022',
      name: 'Titill 1',
      adviceCount: 0,
      shortDescription: 'string',
      status: 'Til umsagnar',
      institution: 'string',
      type: 'string',
      policyArea: 'string',
      processBegins: '2023-01-12T15:41:50.063Z',
      processEnds: '2023-01-12T15:41:50.063Z',
      created: '2023-01-12T15:41:50.063Z',
    },
    {
      id: 0,
      caseNumber: 'NR.S-76/2022',
      name: 'Titill 2',
      adviceCount: 0,
      shortDescription: 'string',
      status: 'Til umsagnar',
      institution: 'string',
      type: 'string',
      policyArea: 'string',
      processBegins: '2023-01-12T15:41:50.063Z',
      processEnds: '2023-01-12T15:41:50.063Z',
      created: '2023-01-12T15:41:50.063Z',
    },
    {
      id: 0,
      caseNumber: 'NR.S-76/2022',
      name: 'Titill 3',
      adviceCount: 0,
      shortDescription: 'string',
      status: 'Til umsagnar',
      institution: 'string',
      type: 'string',
      policyArea: 'string',
      processBegins: '2023-01-12T15:41:50.063Z',
      processEnds: '2023-01-12T15:41:50.063Z',
      created: '2023-01-12T15:41:50.063Z',
    },
    {
      id: 0,
      caseNumber: 'NR.S-76/2022',
      name: 'Titill 4',
      adviceCount: 0,
      shortDescription: 'string',
      status: 'Til umsagnar',
      institution: 'string',
      type: 'string',
      policyArea: 'string',
      processBegins: '2023-01-12T15:41:50.063Z',
      processEnds: '2023-01-12T15:41:50.063Z',
      created: '2023-01-12T15:41:50.063Z',
    },
    {
      id: 0,
      caseNumber: 'NR.S-76/2022',
      name: 'Titill 5',
      adviceCount: 0,
      shortDescription: 'string',
      status: 'Til umsagnar',
      institution: 'string',
      type: 'string',
      policyArea: 'string',
      processBegins: '2023-01-12T15:41:50.063Z',
      processEnds: '2023-01-12T15:41:50.063Z',
      created: '2023-01-12T15:41:50.063Z',
    },
    {
      id: 6,
      caseNumber: 'NR.S-76/2022',
      name: 'Titill 6',
      adviceCount: 0,
      shortDescription: 'string',
      status: 'Til umsagnar',
      institution: 'string',
      type: 'string',
      policyArea: 'string',
      processBegins: '2023-01-12T15:41:50.063Z',
      processEnds: '2023-01-12T15:41:50.063Z',
      created: '2023-01-12T15:41:50.063Z',
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
    <div>
      <GridRow>
        <GridColumn
          paddingBottom={2}
          paddingTop={2}
          span={['0', '0', '6/12', '6/12', '6/12']}
        >
          <AsyncSearch
            options={options}
            placeholder="Að hverju ertu að leita?"
            initialInputValue=""
            inputValue={searchValue}
            onInputValueChange={(value) => {
              setSearchValue(value)
            }}
          />
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
    </div>
  )
}

export default Index

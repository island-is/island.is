import { GridColumn, GridRow, Tiles } from '@island.is/island-ui/core'
import React from 'react'
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
      id: 0,
      caseNumber: 'NR.S-76/2022',
      name: 'string',
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
      name: 'string',
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
      name: 'string',
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
      name: 'string',
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
      name: 'string',
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
      name: 'string',
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
  return (
    <Layout showIcon={false}>
      <GridRow>
        <GridColumn span={['0', '0', '3/12', '3/12', '3/12']}></GridColumn>
        <GridColumn span={['12/12', '12/12', '9/12', '9/12', '9/12']}>
          {dummycontent && (
            <Tiles space={3} columns={[1, 1, 1, 2, 3]}>
              {dummycontent.map((item, index) => {
                return <Card key={index} {...item} />
              })}
            </Tiles>
          )}
        </GridColumn>
      </GridRow>
    </Layout>
  )
}

export default Index

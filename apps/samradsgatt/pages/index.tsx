import { GridColumn, GridRow, Tiles } from '@island.is/island-ui/core'
import React from 'react'
import Card from '../components/Card/Card'
import { useGetApiCaseQuery } from '../lib/samradsgattApi-generated'
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
  const { data } = useGetApiCaseQuery()

  return (
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
  )
}

export default Index

import React from 'react'
import { GridColumn, GridRow, GridContainer } from '@island.is/island-ui/core'
import LeftSideColumn from '../../components/CaseDetails/LeftSideColumn/LeftSideColumn'
import MainColumn from '../../components/CaseDetails/MainColumn/MainColumn'
import RightSideColumn from '../../components/CaseDetails/RightSideColumn/RightSideColumn'

const Details: React.FC = () => {
  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={'3/12'} paddingBottom={3}>
          <LeftSideColumn />
        </GridColumn>
        <GridColumn span={'6/12'} paddingBottom={3} paddingTop={10}>
          <MainColumn />
        </GridColumn>
        <GridColumn span={'3/12'}>
          <RightSideColumn />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Details

import React from 'react'
import { GridColumn, GridRow, GridContainer } from '@island.is/island-ui/core'
import LeftSideColumn from '../../components/CaseDetails/LeftSideColumn/LeftSideColumn'
import MainColumn from '../../components/CaseDetails/MainColumn/MainColumn'
import RightSideColumn from '../../components/CaseDetails/RightSideColumn/RightSideColumn'

interface DetailsProps {
  caseNumber: string
}

const Details: React.FC<DetailsProps> = () => {
  const chosenCase = {
    caseNumber: '76/2022',
  }

  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={'3/12'} paddingBottom={3}>
          <LeftSideColumn caseNumber={chosenCase.caseNumber} />
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

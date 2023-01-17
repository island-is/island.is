import React from 'react'
import { GridColumn, GridRow, GridContainer } from '@island.is/island-ui/core'
import LeftSideColumn from '../../components/CaseDetails/LeftSideColumn/LeftSideColumn'
import MainColumn from '../../components/CaseDetails/MainColumn/MainColumn'
import RightSideColumn from '../../components/CaseDetails/RightSideColumn/RightSideColumn'
import { Case } from '../../types/viewModels'

interface DetailsProps {
  detailedCase: Case
}

const Details: React.FC<DetailsProps> = ({ detailedCase }) => {
  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={'3/12'} paddingBottom={3}>
          <LeftSideColumn />
        </GridColumn>
        <GridColumn span={'6/12'} paddingBottom={3} paddingTop={10}>
          <MainColumn detailedCase={detailedCase} />
        </GridColumn>
        <GridColumn span={'3/12'}>
          <RightSideColumn detailedCase={detailedCase} />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
export default Details

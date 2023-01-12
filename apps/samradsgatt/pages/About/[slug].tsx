import { GridColumn, GridContainer, GridRow } from '@island.is/island-ui/core'
import React from 'react'

interface AboutProps {
  information: string
}

const AboutPage: React.FC<AboutProps> = () => {
  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={'3/12'} paddingBottom={3}>
          {/* <LeftSideColumn /> */}
        </GridColumn>
        <GridColumn span={'6/12'} paddingBottom={3} paddingTop={10}>
          <div>About samradsgatt</div>
          {/* <MainColumn /> */}
        </GridColumn>
        <GridColumn span={'3/12'}>{/* <RightSideColumn /> */}</GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default AboutPage

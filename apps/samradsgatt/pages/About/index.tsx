import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import MainColumn from '../../components/About/MainColumn'
import React from 'react'
import RightSideColmn from '../../components/About/RightSideColumn'

interface AboutProps {
  information: string
}

const AboutPage: React.FC<AboutProps> = () => {
  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={'3/12'} paddingBottom={3}>
          {/* <LeftSideColumn /> */}
          <Box paddingY={3}>{'Breadcrumbs'}</Box>
        </GridColumn>
        <GridColumn span={'6/12'} paddingBottom={3} paddingTop={10}>
          <MainColumn />
        </GridColumn>
        <GridColumn span={'3/12'}>
          <RightSideColmn aboutHeadings={null}></RightSideColmn>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default AboutPage

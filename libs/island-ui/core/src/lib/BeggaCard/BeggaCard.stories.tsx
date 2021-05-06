import React from 'react'
import { BeggaCard } from './BeggaCard'
import { Box } from '../Box/Box'
import { GridContainer } from '../Grid/GridContainer/GridContainer'
import { GridRow } from '../Grid/GridRow/GridRow'
import { GridColumn } from '../Grid/GridColumn/GridColumn'

export default {
  title: 'Cards/BeggaCard',
  component: BeggaCard,
}

export const Default = () => {
  return (
    <Box paddingY={2}>
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '6/12', '4/12']}>
            <Box marginBottom={3}>
              <BeggaCard
                title="Reynslusögur"
                description="Reynslusögur ykkar af opinberri þjónustu hjálpa okkur að gera hana betri og ánægjulegri."
                image="https://www.stevensegallery.com/260/220"
                link={{ text: 'Segðu þína sögu', url: '#' }}
              />
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export const Icon = () => {
  return (
    <Box paddingY={2}>
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '6/12', '4/12']}>
            <Box marginBottom={3}>
              <BeggaCard
                title="Athugið"
                description="Vegna smithættu af völdum COVID 19 hvetja sýslumenn alla viðskiptavini sína til að forðast að koma í afgreiðslur embættanna."
                variant="icon"
                icon="warning"
                link={{ text: 'Rafræn samskipti', url: '#' }}
              />
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

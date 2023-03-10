import {
  Columns,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Inline,
} from '@island.is/island-ui/core'
import MainColumn from '../../components/About/MainColumn'
import React from 'react'
import RightSideColumn from '../../components/About/RightSideColumn'
import Layout from '../../components/Layout/Layout'
import BreadcrumbsWithMobileDivider from '../../components/BreadcrumbsWithMobileDivider/BreadcrumbsWithMobileDivider'

interface AboutProps {
  information: string
}

const AboutPage: React.FC<AboutProps> = () => {
  return (
    <Layout>
      <BreadcrumbsWithMobileDivider
        items={[
          { title: 'Samráðsgátt', href: '/' },
          { title: 'Um samráðsgátt' },
        ]}
      />
      <GridContainer>
        <GridRow>
          <Columns space={[3, 3, 20, 20, 20]} collapseBelow="md">
            <GridColumn
              order={[2, 2, 1, 1, 1]}
              span={['12/12', '9/12', '9/12', '6/12', '6/12']}
              offset={['0', '0', '0', '3/12', '3/12']}
            >
              <MainColumn />
            </GridColumn>
            <GridColumn
              order={[1, 1, 2, 2, 2]}
              span={['0', '3/12', '3/12', '3/12', '3/12']}
            >
              <RightSideColumn />
            </GridColumn>
          </Columns>
        </GridRow>
      </GridContainer>
    </Layout>
  )
}

export default AboutPage

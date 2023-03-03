import {
  Box,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import MainColumn from '../../components/About/MainColumn'
import React from 'react'
import RightSideColmn from '../../components/About/RightSideColumn'
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
          <GridColumn span={'6/12'} paddingBottom={3} paddingTop={10}>
            <MainColumn />
          </GridColumn>
          <GridColumn span={'3/12'}>
            <RightSideColmn aboutHeadings={null}></RightSideColmn>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Layout>
  )
}

export default AboutPage

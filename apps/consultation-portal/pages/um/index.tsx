import { GridColumn, GridContainer, GridRow } from '@island.is/island-ui/core'
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
    <Layout seo={{ title: 'Um samráðsgátt', url: 'um' }}>
      <BreadcrumbsWithMobileDivider
        items={[
          { title: 'Samráðsgátt', href: '/' },
          { title: 'Um samráðsgátt' },
        ]}
      />
      <GridContainer>
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '9/12', '9/12', '6/12']}
            offset={['0', '0', '0', '0', '3/12']}
            order={[1, 1, 0]}
          >
            <MainColumn />
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '3/12', '3/12', '3/12']}
            order={[0, 0, 1]}
          >
            <RightSideColumn />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Layout>
  )
}

export default AboutPage

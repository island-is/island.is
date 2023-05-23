import { GridColumn, GridContainer, GridRow } from '@island.is/island-ui/core'
import React from 'react'
import Layout from '../../components/Layout/Layout'
import BreadcrumbsWithMobileDivider from '../../components/BreadcrumbsWithMobileDivider/BreadcrumbsWithMobileDivider'
import { AboutContent, TableOfContents } from './components'

const AboutScreen: React.FC = () => {
  return (
    <Layout seo={{ title: 'Um samráðsgátt', url: 'um' }}>
      <BreadcrumbsWithMobileDivider
        items={[
          { title: 'Samráðsgátt', href: '/samradsgatt' },
          { title: 'Um samráðsgátt' },
        ]}
      />
      <GridContainer>
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '9/12', '9/12', '8/12']}
            offset={['0', '0', '0', '0', '1/12']}
            order={[1, 1, 0]}
          >
            <AboutContent />
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '3/12', '3/12', '3/12']}
            order={[0, 0, 1]}
          >
            <TableOfContents />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Layout>
  )
}

export default AboutScreen

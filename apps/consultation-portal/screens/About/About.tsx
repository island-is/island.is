import { GridColumn, GridContainer, GridRow } from '@island.is/island-ui/core'
import React from 'react'
import { Breadcrumbs, Layout } from '../../components'
import { AboutContent, TableOfContents } from './components'
import localization from './About.json'

const AboutScreen: React.FC<React.PropsWithChildren<unknown>> = () => {
  const loc = localization['about']

  return (
    <Layout
      seo={{
        title: loc.seo.title,
        url: loc.seo.url,
        description: loc.seo.description,
        keywords: loc.seo.keywords,
      }}
    >
      <Breadcrumbs
        items={[
          { title: loc.breadcrumbs[0].title, href: loc.breadcrumbs[0].href },
          { title: loc.breadcrumbs[1].title },
        ]}
      />
      <GridContainer>
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '9/12', '9/12', '9/12']}
            order={[1, 1, 0]}
          >
            <AboutContent />
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '3/12', '2/12', '2/12']}
            order={[0, 0, 1]}
            offset={['0', '0', '0', '1/12', '1/12']}
          >
            <TableOfContents />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Layout>
  )
}

export default AboutScreen

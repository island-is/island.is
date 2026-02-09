import { Box, GridContainer, Text } from '@island.is/island-ui/core'

import { Breadcrumbs, Layout } from '../../components'
import localization from './Statistics.json'
// import { PowerBIComponent } from '../../components/PowerBI'

export const StatisticsScreen = () => {
  const loc = localization['statistics']

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
        <Box paddingTop={4} paddingBottom={6}>
          <Text>{loc.temporarilyUnavailable}</Text>
        </Box>
        {/* <PowerBIComponent /> */}
      </GridContainer>
    </Layout>
  )
}

export default StatisticsScreen

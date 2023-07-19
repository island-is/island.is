import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import React from 'react'
import { Breadcrumbs, Text, Box } from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'

import { GridContainer, GridRow, GridColumn } from '@island.is/island-ui/core'

import { Section } from '@island.is/web/components'

const title = 'Óskalisti þjóðarinnar'

function Stuff() {
  return (
    <Box id="main-content" position="relative" style={{ overflow: 'hidden' }}>
      <Section>
        <GridContainer>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '12/12']} paddingBottom={2}>
              <Box marginBottom={3}>
                <Breadcrumbs
                  items={[
                    {
                      title: 'Ísland.is',
                      href: '/',
                    },
                    {
                      title: title,
                    },
                  ]}
                />
              </Box>
              <Text variant="h1" as="h1" paddingBottom={4}>
                {title}
              </Text>
              <iframe
                frameBorder="0"
                scrolling="no"
                width="100%"
                height="2500px"
                src="https://islandis.featureupvote.com/"
              ></iframe>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Section>
      <Section aria-labelledby="factsCardsTitle" paddingBottom={8}></Section>
      <Section paddingBottom={8}>
        <GridContainer>
          <GridRow></GridRow>
        </GridContainer>
      </Section>
      <Section
        paddingTop={[8, 8, 6]}
        paddingBottom={[8, 8, 6]}
        aria-labelledby="dataLinksSection"
      ></Section>
    </Box>
  )
}

export default withApollo(withLocale('is')(withMainLayout(Stuff)))

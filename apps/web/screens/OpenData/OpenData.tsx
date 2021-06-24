/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {
  GridContainer,
  Box,
  GridRow,
  GridColumn,
  Breadcrumbs,
  Inline,
  Stack,
} from '@island.is/island-ui/core'
import NextLink from 'next/link'
import { Screen } from '@island.is/web/types'
import {
  Section,
  Categories,
  SearchInput,
  FrontpageSlider,
  LatestNewsSectionSlider,
  FactsCardsSection
} from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { useLinkResolver } from '../../hooks/useLinkResolver'

const OpenDataPage: Screen = () => {
  const { linkResolver } = useLinkResolver()


  return (
    <Box paddingY={[2, 2, 10]} id="main-content">
      <Section aria-labelledby="lifeEventsTitle" background="purple100">
        {/* <Inline space={4}>
          <Stack space={2}> */}
            <GridContainer>
              <GridRow>
                <GridColumn>
                  <Box paddingX={[3, 3, 8]}>
                    <Breadcrumbs
                      items={[
                        {
                          title: 'Ísland.is',
                          href: '/',
                        },
                        {
                          title: 'Gagnatorg',
                        },
                      ]}
                      renderLink={(link) => {
                        return (
                          <NextLink {...linkResolver('homepage')} passHref>
                            {link}
                          </NextLink>
                        )
                      }}
                    />
                  </Box>
                </GridColumn>
              </GridRow>
            </GridContainer>
          {/* </Stack>
        </Inline> */}
      </Section>
      <Section
        aria-labelledby="factsCardsTitle"
      >
        <FactsCardsSection
          title='Stafrænt Ísland'
          linkTitle='hér kemur linkur'
        />
      </Section>
    </Box>
  )
}

export default withMainLayout(OpenDataPage)

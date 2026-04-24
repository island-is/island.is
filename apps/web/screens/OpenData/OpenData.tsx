/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { useMeasure } from 'react-use'
import cn from 'classnames'
import NextLink from 'next/link'

import {
  Box,
  Breadcrumbs,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import {
  ChartsCard,
  DataLinkSection,
  Header,
  Section,
  SectionTitle,
  SimpleLineChart,
  StatisticsCardsSection,
} from '@island.is/web/components'
import {
  ContentLanguage,
  GetGroupedMenuQuery,
  GetOpenDataPageQuery,
  GetOrganizationLogosQuery,
  QueryGetGroupedMenuArgs,
  QueryGetOpenDataPageArgs,
  QueryGetOrganizationsArgs,
} from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'

import { buildHeaderNavData } from '../../components/Header/buildHeaderNavData'
import type { HeaderNavData } from '../../components/Header/headerNavData'
import { useLinkResolver } from '../../hooks/useLinkResolver'
import { GET_OPEN_DATA_PAGE_QUERY } from '../queries'
import { GET_GROUPED_MENU_QUERY } from '../queries/Menu'
import { GET_ORGANIZATION_LOGOS_QUERY } from '../queries/Organization'
import * as styles from './OpenData.css'

interface OpenDataProps {
  page: GetOpenDataPageQuery['getOpenDataPage']
  headerNavData?: HeaderNavData | null
}

const OpenDataPage: Screen<OpenDataProps> = ({ page, headerNavData }) => {
  const { linkResolver } = useLinkResolver()
  const {
    pageTitle,
    pageDescription,
    pageHeaderGraph,
    link,
    linkTitle,
    statisticsCardsSection,
    chartSectionTitle,
    graphCards,
    externalLinkCardSelection,
    externalLinkSectionTitle,
    externalLinkSectionDescription,
    externalLinkSectionImage,
  } = page
  const [ref, { width, height: _height }] = useMeasure()
  return (
    <Box id="main-content" position="relative" style={{ overflow: 'hidden' }}>
      <Box background="blue100">
        <Header headerNavData={headerNavData} />
      </Box>
      <Section
        aria-labelledby="openDataHeroTitle"
        background="blue100"
        paddingBottom={6}
        paddingTop={4}
      >
        <GridContainer>
          <GridRow>
            <GridColumn span={['12/12', '5/12', '5/12']} paddingBottom={2}>
              <Box marginBottom={3}>
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
                      <NextLink
                        {...linkResolver('opendatapage')}
                        passHref
                        legacyBehavior
                      >
                        {link}
                      </NextLink>
                    )
                  }}
                />
              </Box>
              <Text variant="h1" as="h1" paddingBottom={4}>
                {pageTitle}
              </Text>
              <Text paddingBottom={4}>{pageDescription}</Text>
              <Box display={'flex'} justifyContent="flexStart" marginTop={3}>
                <Link href={link} skipTab>
                  <Button
                    icon="arrowForward"
                    iconType="filled"
                    variant="text"
                    as="span"
                  >
                    {linkTitle}
                  </Button>
                </Link>
              </Box>
            </GridColumn>
            <GridColumn span={['12/12', '7/12', '7/12']}>
              <Box
                ref={ref}
                className={cn(styles.headerGraphWrapper, {
                  [styles.scroll]: width < 700,
                })}
              >
                <Box className={styles.headerGraphParent}>
                  <SimpleLineChart graphData={pageHeaderGraph} />
                </Box>
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Section>
      <Section aria-labelledby="factsCardsTitle" paddingBottom={8}>
        <StatisticsCardsSection
          title="Stafrænt Ísland"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          cards={statisticsCardsSection}
        />
      </Section>
      <Section paddingBottom={8}>
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12">
              <SectionTitle title={chartSectionTitle} icon="business" />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['12/12', '4/12', '4/12']}>
              <ChartsCard
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                chart={graphCards[1]}
              />
            </GridColumn>
            <GridColumn span={['12/12', '8/12', '8/12']}>
              <ChartsCard
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                chart={graphCards[0]}
              />
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Section>
      <Section
        paddingTop={[8, 8, 6]}
        paddingBottom={[8, 8, 6]}
        aria-labelledby="dataLinksSection"
      >
        <DataLinkSection
          title={externalLinkSectionTitle}
          titleId="OpenDataLinksTitle"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          image={externalLinkSectionImage}
          description={externalLinkSectionDescription}
          cards={externalLinkCardSelection.cards}
        />
      </Section>
    </Box>
  )
}

OpenDataPage.getProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getOpenDataPage: page },
    },
    headerNavMenuData,
    headerNavOrganizations,
  ] = await Promise.all([
    apolloClient.query<GetOpenDataPageQuery, QueryGetOpenDataPageArgs>({
      query: GET_OPEN_DATA_PAGE_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<GetGroupedMenuQuery, QueryGetGroupedMenuArgs>({
        query: GET_GROUPED_MENU_QUERY,
        variables: {
          input: { id: '1SCm5KnfQ3DrWT600MTt82', lang: locale },
        },
      })
      .then((res) => res.data.getGroupedMenu)
      .catch(() => null),
    apolloClient
      .query<GetOrganizationLogosQuery, QueryGetOrganizationsArgs>({
        query: GET_ORGANIZATION_LOGOS_QUERY,
        variables: {
          input: { lang: locale as ContentLanguage },
        },
      })
      .then((res) => res.data.getOrganizations?.items ?? [])
      .catch(() => []),
  ])

  return {
    page,
    headerNavData: buildHeaderNavData(
      headerNavMenuData,
      headerNavOrganizations,
      locale as Locale,
    ),
  }
}

export default withMainLayout(OpenDataPage, {
  showHeader: false,
})

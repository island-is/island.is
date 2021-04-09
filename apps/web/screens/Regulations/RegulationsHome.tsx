import {
  Ministry,
  LawChapterTree,
  RegulationListItem,
  MinistryFull,
} from './Regulations.types'

import {
  RegulationHomeTexts,
  regulationsSearchResults,
} from './Regulations.mock'

import React from 'react'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import getConfig from 'next/config'
import { CustomNextError } from '@island.is/web/units/errors'
import { SubpageDetailsContent } from '@island.is/web/components'
import { RegulationsHomeImg } from './RegulationsHomeImg'
import { SubpageLayout } from '@island.is/web/screens/Layouts/Layouts'
import {
  Box,
  Breadcrumbs,
  CategoryCard,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import {
  RegulationSearchFilters,
  RegulationsSearchSection,
} from './RegulationsSearchSection'
import { shuffle } from 'lodash'
import { getParams, useRegulationLinkResolver } from './regulationUtils'
import { getUiTexts } from './getUiTexts'
import {
  GetRegulationsQuery,
  QueryGetRegulationsArgs,
  GetRegulationsYearsQuery,
  GetRegulationsMinistriesQuery,
  GetRegulationsLawChaptersQuery,
  QueryGetRegulationsLawChaptersArgs,
} from '@island.is/web/graphql/schema'
import {
  GET_REGULATIONS_LAWCHAPTERS_QUERY,
  GET_REGULATIONS_MINISTRIES_QUERY,
  GET_REGULATIONS_QUERY,
  GET_REGULATIONS_YEARS_QUERY,
} from '../queries'

const { publicRuntimeConfig } = getConfig()

// ---------------------------------------------------------------------------

type RegulationsHomeProps = {
  regulations: RegulationListItem[]
  texts: RegulationHomeTexts
  searchQuery: RegulationSearchFilters
  years: ReadonlyArray<number>
  ministries: ReadonlyArray<Ministry>
  lawChapters: Readonly<LawChapterTree>
}

const RegulationsHome: Screen<RegulationsHomeProps> = (props) => {
  const { disableRegulationsPage: disablePage } = publicRuntimeConfig
  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  const txt = useNamespace(props.texts)
  const { linkResolver, linkToRegulation } = useRegulationLinkResolver()

  const breadCrumbs = (
    <Box display={['none', 'none', 'block']}>
      {/* Show when NOT a device */}
      <Breadcrumbs
        items={[
          {
            title: txt('crumbs_1'),
            href: linkResolver('homepage').href,
          },
          {
            title: txt('crumbs_2'),
            href: linkResolver('article').href,
          },
          {
            title: txt('crumbs_3'),
            href: linkResolver('regulationshome').href,
          },
        ]}
      />
    </Box>
  )

  return (
    <SubpageLayout
      main={
        <>
          <GridContainer>
            <GridRow>
              <GridColumn
                offset={['0', '0', '0', '0', '1/12']}
                span={['1/1', '1/1', '1/1', '9/12', '7/12']}
                paddingTop={[0, 0, 0, 8]}
                paddingBottom={[4, 4, 4, 4, 1]}
              >
                {breadCrumbs}
                <Text as="h1" variant="h1" marginTop={2}>
                  {txt('homeIntroLegend')}
                </Text>
                <Text variant="intro" as="p">
                  {txt('homeIntro')}
                </Text>
              </GridColumn>

              <GridColumn
                span="3/12"
                hiddenBelow="lg"
                paddingTop={[0, 0, 0, 2]}
                paddingBottom={0}
              >
                <RegulationsHomeImg />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span="12/12" paddingTop={0} paddingBottom={[4, 4, 4]}>
                <RegulationsSearchSection
                  searchFilters={props.searchQuery}
                  lawChapters={props.lawChapters}
                  ministries={props.ministries}
                  years={props.years}
                  texts={props.texts}
                />
              </GridColumn>
            </GridRow>
          </GridContainer>
        </>
      }
      details={
        <SubpageDetailsContent
          header=""
          content={
            <GridContainer>
              <GridRow>
                {props.regulations.map((reg, i) => (
                  <GridColumn
                    key={reg.name}
                    span={['1/1', '1/2', '1/2', '1/3']}
                    paddingTop={3}
                    paddingBottom={4}
                  >
                    <CategoryCard
                      href={linkToRegulation(reg.name)}
                      heading={reg.name}
                      text={reg.title}
                      tags={
                        reg.ministry && [
                          { label: reg.ministry.name, disabled: true },
                        ]
                      }
                    />
                  </GridColumn>
                ))}
              </GridRow>
            </GridContainer>
          }
        />
      }
    />
  )
}

RegulationsHome.getInitialProps = async (ctx) => {
  const { apolloClient, locale, query } = ctx
  const serviceId = String(query.slug)
  const searchQuery = getParams(query, ['q', 'rn', 'year', 'ch', 'all'])
  const doSearch = Object.values(searchQuery).some((value) => !!value)

  const [
    texts,
    regulations,
    years,
    ministries,
    lawChapters,
  ] = await Promise.all([
    await getUiTexts<RegulationHomeTexts>(
      apolloClient,
      locale,
      'Regulations_Home',
    ),

    doSearch
      ? [regulationsSearchResults[0]].concat(
          shuffle(regulationsSearchResults).slice(
            Math.floor(5 * Math.random()),
          ),
        )
      : apolloClient
          .query<GetRegulationsQuery, QueryGetRegulationsArgs>({
            query: GET_REGULATIONS_QUERY,
            variables: {
              input: {
                type: 'newest',
                page: 1,
              },
            },
          })
          .then((res) => res.data?.getRegulations.data as RegulationListItem[]),

    apolloClient
      .query<GetRegulationsYearsQuery>({
        query: GET_REGULATIONS_YEARS_QUERY,
      })
      .then((res) => res.data?.getRegulationsYears as Array<number>),

    apolloClient
      .query<GetRegulationsMinistriesQuery>({
        query: GET_REGULATIONS_MINISTRIES_QUERY,
      })
      .then((res) => res.data?.getRegulationsMinistries as Array<MinistryFull>),

    apolloClient
      .query<
        GetRegulationsLawChaptersQuery,
        QueryGetRegulationsLawChaptersArgs
      >({
        query: GET_REGULATIONS_LAWCHAPTERS_QUERY,
        variables: {
          input: {
            tree: true,
          },
        },
      })
      .then((res) => res.data?.getRegulationsLawChapters as LawChapterTree),
  ])

  return {
    regulations,
    texts,
    searchQuery,
    years,
    ministries,
    lawChapters,
  }
}

export default withMainLayout(RegulationsHome)

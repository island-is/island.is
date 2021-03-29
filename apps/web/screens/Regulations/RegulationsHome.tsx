import {
  regulationsSearchResults,
  homeTexts,
  Ministry,
  LawChapterTree,
  RegulationHomeTexts,
  RegulationListItem,
  MinistryFull,
} from './mockData'

import React from 'react'
import { useRouter } from 'next/router'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
// import getConfig from 'next/config'
// import { CustomNextError } from '@island.is/web/units/errors'
import { SubpageDetailsContent } from '@island.is/web/components'
import { RegulationsHomeImg } from './RegulationsHomeImg'
import { SubpageLayout } from '@island.is/web/screens/Layouts/Layouts'
import {
  Box,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { RichText, richText } from '@island.is/island-ui/contentful'
import {
  RegulationSearchFilters,
  RegulationsSearchSection,
} from './RegulationsSearchSection'
import { shuffle } from 'lodash'
import { getParams } from './regulationUtils'
import { getUiTexts } from './getUiTexts'
import {
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  GetRegulationsQuery,
  QueryGetRegulationsArgs,
  GetRegulationsYearsQuery,
  QueryGetRegulationsYearsArgs,
  GetRegulationsMinistriesQuery,
  QueryGetRegulationsMinistriesArgs,
  GetRegulationsLawChaptersQuery,
  QueryGetRegulationsLawChaptersArgs,
} from '@island.is/web/graphql/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_REGULATIONS_LAWCHAPTERS_QUERY,
  GET_REGULATIONS_MINISTRIES_QUERY,
  GET_REGULATIONS_QUERY,
  GET_REGULATIONS_YEARS_QUERY,
} from '../queries'
import { log } from 'xstate/lib/actions'

// const { publicRuntimeConfig } = getConfig()

// ---------------------------------------------------------------------------

type RegulationsHomeProps = {
  regulations: RegulationListItem[]
  texts: RegulationHomeTexts
  searchQuery: RegulationSearchFilters
  years: ReadonlyArray<number>
  ministries: ReadonlyArray<Ministry>
  lawcCapters: Readonly<LawChapterTree>
}

const RegulationsHome: Screen<RegulationsHomeProps> = (props) => {
  const router = useRouter()
  const n = useNamespace(props.texts)
  const { linkResolver } = useLinkResolver()

  // const { disableApiCatalog } = publicRuntimeConfig
  // if (disableApiCatalog === 'true') {
  //   throw new CustomNextError(404, 'Not found')
  // }

  // const navigationItems = useMemo(
  //   () => [
  //     {
  //       title: n('homeIntroLegend'),
  //       href: '/reglugerðir',
  //       active: true,
  //       items: [
  //         {
  //           title: 'Nýjustu reglugerðir',
  //           href: '/reglugerdir',
  //           active: true,
  //         },
  //         {
  //           title: 'Ráðuneyti',
  //           href: '/reglugerdir/sub1',
  //         },
  //         {
  //           title: 'Kaflar í lagasafni',
  //           href: '/reglugerdir/sub2',
  //         },
  //         {
  //           title: 'Útgáfuár',
  //           href: '/reglugerdir/sub3',
  //         },
  //         {
  //           title: 'Stofnreglugerðir',
  //           href: '/reglugerdir/sub3',
  //         },
  //         {
  //           title: 'Brottfallnar',
  //           href: '/reglugerdir/sub3',
  //         },
  //       ],
  //     },
  //   ],
  //   [props.texts],
  // )

  // Values nicked from apps/web/screens/Layouts/SidebarLayout.tsx

  const paddingTop = [0, 0, 8] as const
  const paddingBottom = 8

  const breadCrumbs = (
    <Box display={['none', 'none', 'block']}>
      {/* Show when NOT a device */}
      <Breadcrumbs
        items={[
          {
            title: n('crumbs_1'),
            href: linkResolver('homepage').href,
          },
          {
            title: n('crumbs_2'),
            href: linkResolver('article').href,
          },
        ]}
      />
    </Box>
  )

  return (
    <SubpageLayout
      main={
        // <SidebarLayout
        //   fullWidthContent="right"
        //   sidebarContent={
        //     <Navigation
        //       baseId="service-details-navigation"
        //       colorScheme="blue"
        //       items={navigationItems}
        //       title={n('navigationTitle')}
        //       titleLink={linkResolver('homepage')}
        //     />
        //   }
        // >
        //   <SubpageMainContent
        //     main={
        //       <>
        //         {breadCrumbs}
        //         <Text as="h1" variant="h1" marginTop={2}>
        //           {n('homeIntroLegend')}
        //         </Text>
        //         <Text variant="intro" as="p">
        //           {n('regulationsIntro')}
        //         </Text>
        //       </>
        //     }
        //     image={
        //       <Image
        //         type="custom"
        //         src={n('homeIntroImageUrl')}
        //         thumbnail={n('homeIntroImageThumbnailUrl')}
        //         originalWidth={400}
        //         originalHeight={400}
        //         alt=""
        //       />
        //     }
        //   />
        // </SidebarLayout>
        <GridContainer>
          <GridRow>
            <GridColumn
              offset={['0', '0', '0', '1/12']}
              span={['1/1', '1/1', '1/1', '7/12']}
              paddingTop={paddingTop}
              paddingBottom={paddingBottom}
            >
              {breadCrumbs}
              <Text as="h1" variant="h1" marginTop={2}>
                {n('homeIntroLegend')}
              </Text>
              <Text variant="intro" as="p">
                {n('homeIntro')}
              </Text>
            </GridColumn>

            <GridColumn
              span="3/12"
              hiddenBelow="lg"
              paddingTop={paddingTop}
              paddingBottom={paddingBottom}
            >
              <RegulationsHomeImg />
            </GridColumn>
          </GridRow>
        </GridContainer>
      }
      details={
        <SubpageDetailsContent
          header=""
          content={
            <RegulationsSearchSection
              searchResults={props.regulations}
              searchFilters={props.searchQuery}
              lawcCapters={props.lawcCapters}
              ministries={props.ministries}
              years={props.years}
              texts={props.texts}
            />
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

  const [
    texts,
    regulationsData,
    regulationYears,
    allMinistries,
    allLawChaptersTree,
  ] = await Promise.all([
    await getUiTexts<RegulationHomeTexts>(
      apolloClient,
      locale,
      'Regulations_Home',
      homeTexts,
    ),

    apolloClient.query<GetRegulationsQuery, QueryGetRegulationsArgs>({
      query: GET_REGULATIONS_QUERY,
      variables: {
        input: {
          type: 'newest',
          page: 1,
        },
      },
    }),
    apolloClient.query<GetRegulationsYearsQuery, QueryGetRegulationsYearsArgs>({
      query: GET_REGULATIONS_YEARS_QUERY,
      variables: {
        input: {
          year: 0, // TODO: remove this
        },
      },
    }),
    apolloClient.query<
      GetRegulationsMinistriesQuery,
      QueryGetRegulationsMinistriesArgs
    >({
      query: GET_REGULATIONS_MINISTRIES_QUERY,
      variables: {
        input: {
          slug: '', // TODO: remove this
        },
      },
    }),
    apolloClient.query<
      GetRegulationsLawChaptersQuery,
      QueryGetRegulationsLawChaptersArgs
    >({
      query: GET_REGULATIONS_LAWCHAPTERS_QUERY,
      variables: {
        input: {
          tree: true,
        },
      },
    }),
  ])

  // TODO: Handle search - make all result sets look new and exciting!
  const searchResults = [regulationsSearchResults[0]].concat(
    shuffle(regulationsSearchResults).slice(Math.floor(5 * Math.random())),
  )

  const regulations =
    (regulationsData?.data?.getRegulations?.data as RegulationListItem[]) ?? []

  return {
    regulations: regulations || searchResults,
    texts,
    searchQuery,
    years: regulationYears?.data?.getRegulationsYears as Array<number>,
    ministries: allMinistries?.data
      ?.getRegulationsMinistries as Array<MinistryFull>,
    lawcCapters: allLawChaptersTree?.data
      ?.getRegulationsLawChapters as LawChapterTree,
  }
}

export default withMainLayout(RegulationsHome)

import { useState } from 'react'
import { useIntl } from 'react-intl'
import NextLink from 'next/link'

import {
  ActionCard,
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  Filter,
  FilterMultiChoice,
  Inline,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { GrantHeaderWithImage, GrantWrapper } from '@island.is/web/components'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  Grant,
  Query,
  QueryGetGrantsArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'

import {
  CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import SidebarLayout from '../../Layouts/SidebarLayout'
import { GET_GRANTS_QUERY } from '../../queries/Grants'
import { m } from '../messages'

const filterState = {
  status: [],
  category: [],
  type: [],
  organization: [],
}

const GrantsSearchResultsPage: CustomScreen<GrantsHomeProps> = ({
  locale,
  grants,
}) => {
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  const parentUrl = linkResolver('styrkjatorg', [], locale).href
  const currentUrl = linkResolver('styrkjatorgsearch', [], locale).href

  const breadcrumbItems: Array<BreadCrumbItem> = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: 'Styrkjatorg',
      href: parentUrl,
    },
    {
      title: 'Leitarniðurstöður',
      href: currentUrl,
      isTag: true,
    },
  ]

  const [searchState, setSearchState] = useState({ q: '', filter: filterState })

  return (
    <GrantWrapper
      pageTitle={'Styrkjatorg'}
      pageDescription={formatMessage(m.home.description)}
      pageFeaturedImage={formatMessage(m.home.featuredImage)}
    >
      <GrantHeaderWithImage
        title={'Styrkjatorg'}
        description="Non scelerisque risus amet tincidunt. Sit sed quis cursus hendrerit nulla egestas interdum. In varius quisque."
        featuredImage={formatMessage(m.home.featuredImage)}
        imageLayout="left"
        breadcrumbs={
          breadcrumbItems && (
            <Breadcrumbs
              items={breadcrumbItems ?? []}
              renderLink={(link, item) => {
                return item?.href ? (
                  <NextLink href={item?.href} legacyBehavior>
                    {link}
                  </NextLink>
                ) : (
                  link
                )
              }}
            />
          )
        }
      />
      <Box background="blue100">
        <SidebarLayout
          sidebarContent={
            <Box component="form" borderRadius="large" action={currentUrl}>
              <Box marginBottom={[1, 1, 2]}>
                <Text variant="h4">Leit</Text>

                <Input
                  name="q"
                  placeholder={formatMessage(m.search.inputPlaceholder)}
                  size="xs"
                  value={searchState.q}
                  onChange={(e) => console.log('update search')}
                />
              </Box>
              <Box background="white" padding={[1, 1, 2]}>
                <Filter
                  labelClearAll={''}
                  labelClear={''}
                  labelOpen={''}
                  onFilterClear={() => console.log('clear ')}
                >
                  <FilterMultiChoice
                    labelClear={''}
                    onChange={() => console.log('change')}
                    onClear={() => console.log('clear')}
                    categories={[
                      {
                        id: 'bleble',
                        label: 'Staða umsóknar',
                        selected: [],
                        filters: [
                          {
                            value: 'Opið fyrir umsóknir',
                            label: 'Opið fyrir umsóknir',
                          },
                          {
                            value: 'Opnar fljótlega',
                            label: 'Opnar fljótlega',
                          },
                          {
                            value: 'Lokað fyrir umsóknir',
                            label: 'Lokað fyrir umsóknir',
                          },
                          {
                            value: 'Óvirkur sjóður',
                            label: 'Óvirkur sjóður',
                          },
                        ],
                      },
                      {
                        id: 'bleble2',
                        label: 'Flokkur',
                        selected: [],
                        filters: [
                          {
                            value: 'Rannsóknir',
                            label: 'Rannsóknir',
                          },
                          {
                            value: 'Nýsköpun',
                            label: 'Nýsköpun',
                          },
                          {
                            value: 'Nám og kennsla',
                            label: 'Nám og kennsla',
                          },
                          {
                            value: 'Starfs- og símenntun',
                            label: 'Starfs- og símenntun',
                          },
                          {
                            value: 'Menning og listir',
                            label: 'Menning og listir',
                          },
                          {
                            value: 'Æskulýðsstarf og íþróttir',
                            label: 'Æskulýðsstarf og íþróttir',
                          },
                          {
                            value: 'Atvinnulíf',
                            label: 'Atvinnulíf',
                          },
                          {
                            value: 'Innlent',
                            label: 'Innlent',
                          },
                          {
                            value: 'Alþjóðlegt',
                            label: 'Alþjóðlegt',
                          },
                        ],
                      },
                      {
                        id: 'bleble4',
                        label: 'Tegund',
                        selected: [],
                        filters: [
                          {
                            value: 'Fjármögnun',
                            label: 'Fjármögnun',
                          },
                          {
                            value: 'Starfslaun',
                            label: 'Starfslaun',
                          },
                          {
                            value: 'Endurgreiðsla kostnaðar',
                            label: 'Endurgreiðsla kostnaðar',
                          },
                          {
                            value: 'Skattafrádráttur',
                            label: 'Skattafrádráttur',
                          },
                          {
                            value: 'Skiptinám',
                            label: 'Skiptinám',
                          },
                          {
                            value: 'Sjálfboðastörf',
                            label: 'Sjálfboðastörf',
                          },
                          {
                            value: 'Tengslamyndun',
                            label: 'Tengslamyndun',
                          },
                        ],
                      },
                      {
                        id: 'bleble3',
                        label: 'Stofnun',
                        selected: [],
                        filters: [
                          {
                            value: 'Rannís',
                            label: 'Rannís',
                          },
                          {
                            value: 'Tónlistarmiðstöð',
                            label: 'Tónlistarmiðstöð',
                          },
                          {
                            value: 'Kvikmyndastöð',
                            label: 'Kvikmyndastöð',
                          },
                          {
                            value: 'Félags- og vinnumarkaðsráðuneytið',
                            label: 'Félags- og vinnumarkaðsráðuneytið',
                          },
                          {
                            value: 'Menningar- og viðskiptaráðuneytið',
                            label: 'Menningar- og viðskiptaráðuneytið',
                          },
                        ],
                      },
                    ]}
                  />
                </Filter>
              </Box>
            </Box>
          }
        >
          <Inline space={2}>
            <ActionCard heading="bingbong" text="hanblo" />
            <ActionCard heading="bingbong" text="hanblo" />
            <ActionCard heading="bingbong" text="hanblo" />
            <ActionCard heading="bingbong" text="hanblo" />
            {grants?.map((grant) => (
              <ActionCard heading={grant.name} text={grant.description ?? ''} />
            ))}
          </Inline>
        </SidebarLayout>
      </Box>
    </GrantWrapper>
  )
}

interface GrantsHomeProps {
  locale: Locale

  grants?: Array<Grant>
}

const GrantsSearchResults: CustomScreen<GrantsHomeProps> = ({
  grants,
  customPageData,
  locale,
}) => {
  return (
    <GrantsSearchResultsPage
      grants={grants}
      locale={locale}
      customPageData={customPageData}
    />
  )
}

GrantsSearchResults.getProps = async ({ apolloClient, locale }) => {
  const {
    data: { getGrants: grants },
  } = await apolloClient.query<Query, QueryGetGrantsArgs>({
    query: GET_GRANTS_QUERY,
    variables: {
      input: {
        lang: locale as ContentLanguage,
      },
    },
  })

  return {
    grants,
    locale: locale as Locale,
    themeConfig: {
      footerVersion: 'organization',
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(CustomPageUniqueIdentifier.Grants, GrantsSearchResults),
)

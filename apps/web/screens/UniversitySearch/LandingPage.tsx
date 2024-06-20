import { useEffect, useState } from 'react'
import cn from 'classnames'
import { useRouter } from 'next/router'

import {
  Accordion,
  AccordionItem,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Icon,
  Input,
  LinkV2,
  Text,
} from '@island.is/island-ui/core'
import { haskolanamTrackSearchQuery } from '@island.is/plausible'
import {
  getThemeConfig,
  OrganizationWrapper,
  SliceMachine,
} from '@island.is/web/components'
import {
  ContentLanguage,
  GetUniversityGatewayUniversitiesQuery,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  UniversityGatewayUniversity,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import { Screen } from '../../types'
import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../queries'
import { GET_UNIVERSITY_GATEWAY_UNIVERSITIES } from '../queries/UniversityGateway'
import * as styles from './UniversitySearch.css'

interface LandingPageProps {
  organizationPage?: Query['getOrganizationPage']
  organization?: Query['getOrganization']
  universities: Array<UniversityGatewayUniversity>
  namespace: Record<string, string>
  locale: string
}
const LandingPage: Screen<LandingPageProps> = ({
  organizationPage,
  namespace,
  universities,
  locale,
}) => {
  const n = useNamespace(namespace)
  const router = useRouter()
  const { linkResolver } = useLinkResolver()
  const [sortedUniversities, setSortedUniversities] = useState<
    UniversityGatewayUniversity[]
  >([])

  useEffect(() => {
    const newArray = [...universities]
    newArray.sort((x, y) => {
      const titleX =
        locale === 'is' ? x.contentfulTitle || '' : x.contentfulTitleEn || ''
      const titleY =
        locale === 'is' ? y.contentfulTitle || '' : y.contentfulTitleEn || ''
      return titleX.localeCompare(titleY, locale)
    })

    setSortedUniversities(newArray)
  }, [universities, locale])
  const [searchTerm, setSearchTerm] = useState('')

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const navList: NavigationItem[] =
    organizationPage?.menuLinks.map(({ primaryLink, childrenLinks }) => ({
      title: primaryLink?.text,
      href: primaryLink?.url,
      active: router.asPath === primaryLink?.url,
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    })) ?? []
  const routeToSearch = () => {
    router.push(`${linkResolver('universitysearch').href}?search=${searchTerm}`)
  }

  const renderFirstSlice = (): React.ReactNode | null => {
    const slice = organizationPage?.slices?.[0]
    if (!slice) return null
    return (
      <Box>
        <SliceMachine
          key={slice.id}
          slice={slice}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          namespace={namespace}
          slug={organizationPage.slug}
          fullWidth={false}
          marginBottom={5}
        />
      </Box>
    )
  }

  return (
    <OrganizationWrapper
      showExternalLinks={true}
      pageTitle={organizationPage?.title ?? ''}
      pageDescription={organizationPage?.description}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      organizationPage={organizationPage}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      pageFeaturedImage={organizationPage?.featuredImage}
      fullWidthContent={true}
      minimal={organizationPage?.theme === 'landing_page'}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
      sidebarContent={
        <>
          <Hidden above="sm">
            <Box marginBottom={4}>
              <Accordion>
                <AccordionItem id="uni_dropdown" label="Háskólar">
                  <Box width="full" className={cn(styles.courseListContainer)}>
                    <Box className={cn(styles.courseListContentContainer)}>
                      <Text variant="eyebrow" color="blueberry600">
                        {n('universities', 'Háskólar')}
                      </Text>
                      {sortedUniversities.map((university) => {
                        return (
                          <Box
                            className={cn(styles.courseListItems)}
                            key={university.contentfulTitle}
                          >
                            <Box style={{ width: '1.5rem', height: '1.5rem' }}>
                              <img
                                src={university.contentfulLogoUrl?.toString()}
                                alt={`logo for ${university.contentfulTitle}`}
                              />
                            </Box>
                            <LinkV2
                              href={
                                locale === 'is'
                                  ? university.contentfulLink?.toString() || '/'
                                  : university.contentfulLinkEn?.toString() ||
                                    '/'
                              }
                            >
                              <Text color="blueberry600">
                                {locale === 'is'
                                  ? university.contentfulTitle || ''
                                  : university.contentfulTitleEn || ''}
                              </Text>
                            </LinkV2>
                          </Box>
                        )
                      })}
                    </Box>
                  </Box>
                </AccordionItem>
              </Accordion>
            </Box>
          </Hidden>
          <Hidden below="md">
            <Box width="full" className={cn(styles.courseListContainer)}>
              <Box
                width="full"
                className={cn(styles.courseListContentContainer)}
              >
                <Text variant="eyebrow" color="blueberry600">
                  {n('universities', 'Háskólar')}
                </Text>
                {sortedUniversities.map((university) => {
                  return (
                    <Box
                      className={cn(styles.courseListItems)}
                      key={university.contentfulTitle}
                    >
                      <Box style={{ width: '1.5rem', height: '1.5rem' }}>
                        <img
                          src={university.contentfulLogoUrl?.toString()}
                          alt={`logo for ${university.contentfulTitle}`}
                        />
                      </Box>
                      <LinkV2
                        href={
                          locale === 'is'
                            ? university.contentfulLink?.toString() || '/'
                            : university.contentfulLinkEn?.toString() || '/'
                        }
                      >
                        <Text color="blueberry600">
                          {locale === 'is'
                            ? university.contentfulTitle || ''
                            : university.contentfulTitleEn || ''}
                        </Text>
                      </LinkV2>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Hidden>
        </>
      }
      mainContent={
        <Box
          paddingTop={0}
          style={{ gap: '2.5rem' }}
          display="flex"
          flexDirection={'column'}
        >
          {renderFirstSlice()}
          <GridContainer>
            <GridRow>
              <GridColumn
                span={['9/9', '9/9', '7/9']}
                offset={['0', '0', '1/9']}
              >
                <Box>
                  <Text variant="h3" paddingBottom={1}>
                    {n('landingPageIntroTitle', 'Finndu þitt nám hér')}
                  </Text>
                  <Text variant="default">
                    {n(
                      'landingPageIntroSubTitle',
                      'Leitaðu upplýsinga um háskólanám á Íslandi.',
                    )}
                  </Text>
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
          <GridContainer>
            <GridRow>
              <GridColumn
                span={['9/9', '9/9', '7/9']}
                offset={['0', '0', '1/9']}
              >
                <Input
                  placeholder={n('searchPrograms', 'Leit í háskólanámi')}
                  id="searchuniversity"
                  name="filterInput"
                  size="md"
                  value={searchTerm}
                  className={cn(styles.searchInput)}
                  backgroundColor="blue"
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                  }}
                  onKeyDown={(k) => {
                    if (k.code === 'Enter') {
                      haskolanamTrackSearchQuery(searchTerm)
                      routeToSearch()
                    }
                  }}
                />
                <button
                  aria-label="Search"
                  className={cn(styles.searchIcon)}
                  onClick={() => {
                    haskolanamTrackSearchQuery(searchTerm)
                    routeToSearch()
                  }}
                >
                  <Icon size="large" icon="search" color="blue400" />
                </button>
              </GridColumn>
            </GridRow>
          </GridContainer>
          {organizationPage?.slices?.map((slice, index) => {
            if (index === 0) return null
            return (
              <Box key={index}>
                <SliceMachine
                  key={slice.id}
                  slice={slice}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  namespace={namespace}
                  slug={organizationPage.slug}
                  fullWidth={organizationPage.theme === 'landing_page'}
                  marginBottom={
                    index === organizationPage.slices.length - 1 ? 5 : 0
                  }
                  paddingBottom={
                    !organizationPage.description && index === 0 ? 0 : 6
                  }
                />
              </Box>
            )
          })}
        </Box>
      }
    >
      {organizationPage?.bottomSlices.map((slice) => (
        <SliceMachine
          key={slice.id}
          slice={slice}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          namespace={namespace}
          slug={organizationPage.slug}
          fullWidth={true}
          params={{
            latestNewsSliceColorVariant:
              organizationPage.theme === 'landing_page' ? 'blue' : 'default',
          }}
        />
      ))}
    </OrganizationWrapper>
  )
}

LandingPage.getProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getOrganizationPage },
    },
    namespace,
    universities,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: locale === 'is' ? 'haskolanam' : 'university-studies',
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'universityGateway',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables?.data?.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
    apolloClient.query<GetUniversityGatewayUniversitiesQuery>({
      query: GET_UNIVERSITY_GATEWAY_UNIVERSITIES,
    }),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Page not found')
  }

  return {
    organizationPage: getOrganizationPage,
    namespace,
    universities: universities.data.universityGatewayUniversities,
    locale,
    showSearchInHeader: false,
    ...getThemeConfig(
      getOrganizationPage?.theme ?? 'landing_page',
      getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(LandingPage, {
  showFooter: false,
})

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import slugify from '@sindresorhus/slugify'

import {
  Box,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  LinkV2,
  ProfileCard,
  Select,
  Stack,
  StringOption as Option,
  Text,
} from '@island.is/island-ui/core'
import {
  getThemeConfig,
  OrganizationFooter,
  OrganizationWrapper,
  Webreader,
} from '@island.is/web/components'
import {
  AnnualReport,
  ContentLanguage,
  GetNamespaceQuery,
  OrganizationPage,
  Query,
  QueryGetAnnualReportsArgs,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { linkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen, ScreenContext } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { getOrganizationSidebarNavigationItems } from '@island.is/web/utils/organization'

import {
  GET_ANNUAL_REPORTS_QUERY,
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
} from '../../queries'
import * as styles from './AnnualReports.css'

export interface AnnualReportsProps {
  organizationPage: OrganizationPage
  namespace: Record<string, string>
  annualReports: AnnualReport[]
}

type AnnualReportsScreenContext = ScreenContext & {
  organizationPage?: Query['getOrganizationPage']
}

const AnnualReports: Screen<AnnualReportsProps, AnnualReportsScreenContext> = ({
  organizationPage,
  namespace,
  annualReports,
}) => {
  useContentfulId(organizationPage?.id)
  useLocalLinkTypeResolver('annualreports')

  const n = useNamespace(namespace)
  const router = useRouter()
  const baseRouterPath = router.asPath.split('?')[0].split('#')[0]
  const { activeLocale } = useI18n()

  const [selectedId, setSelectedId] = useState<string>('')

  const pageTitle = 'Ársskýrslur'

  const dropdownOptions = useMemo(() => {
    return annualReports.map((report) => ({
      label: report.title,
      value: report.id,
      slug: report.slug,
    }))
  }, [annualReports])

  const showDropdown = annualReports?.length > 1

  useEffect(() => {
    const hashString = window.location.hash.replace('#', '')
    if (!dropdownOptions.length) {
      return
    }

    setSelectedId(
      hashString
        ? dropdownOptions.find((x) => x.slug === hashString)?.value ?? ''
        : dropdownOptions[0].value,
    )
  }, [router, dropdownOptions])

  const selectedReport = annualReports.find((x) => x.id === selectedId)

  return (
    <OrganizationWrapper
      pageTitle={pageTitle}
      organizationPage={organizationPage}
      showReadSpeaker={false}
      navigationData={{
        title: n(
          'navigationTitle',
          activeLocale === 'is' ? 'Efnisyfirlit' : 'Menu',
        ),
        items: getOrganizationSidebarNavigationItems(
          organizationPage,
          baseRouterPath,
        ),
      }}
      minimal
      mainContent={
        <Stack space={2}>
          <GridContainer>
            <Box paddingBottom={[2, 2, 4]}>
              <Breadcrumbs
                items={[
                  {
                    title: 'Ísland.is',
                    href: linkResolver('homepage').href,
                  },
                  {
                    title: organizationPage?.title ?? '',
                    href: linkResolver('organizationpage', [
                      organizationPage?.slug ?? '',
                    ]).href,
                  },
                ]}
              />
            </Box>
            <GridRow>
              <GridColumn span="12/12">
                <Text variant="h1" as="h1" marginBottom={0} marginTop={1}>
                  {pageTitle}
                </Text>
                <Webreader
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  readId={null}
                  readClass="rs_read"
                />
              </GridColumn>
            </GridRow>
          </GridContainer>

          <Stack space={4}>
            {showDropdown && (
              <GridRow>
                <GridColumn span={['12/12', '12/12', '6/12', '6/12', '5/12']}>
                  <Select
                    label="Veldu ársskýrslu"
                    name="select-annual-report"
                    size="sm"
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore make web strict
                    onChange={({ value }: Option) => {
                      const slug = dropdownOptions.find(
                        (x) => x.value === value,
                      )?.slug
                      setSelectedId(String(value))
                      router.push(
                        {
                          pathname: router.asPath.split('#')[0],
                          hash: slug,
                        },
                        undefined,
                        { shallow: true },
                      )
                    }}
                    value={dropdownOptions.find((x) => x.value === selectedId)}
                    options={dropdownOptions}
                  />
                </GridColumn>
              </GridRow>
            )}

            {!!selectedReport && (
              <>
                <GridRow>
                  <GridColumn span="12/12">
                    <Text variant="h2" as="h2">
                      {selectedReport.title}
                    </Text>

                    {selectedReport.intro && (
                      <Text variant="intro" as="p" paddingTop={2}>
                        <span
                          className="rs_read"
                          id={slugify(selectedReport.intro)}
                        >
                          {selectedReport.intro}
                        </span>
                      </Text>
                    )}
                  </GridColumn>
                </GridRow>

                <GridRow>
                  <GridColumn span="12/12">
                    <Stack space={4}>
                      {selectedReport?.chapters && (
                        <Box className={styles.profileCardContainer}>
                          {selectedReport.chapters.map((chapter) => {
                            const href = linkResolver('annualreportchapter', [
                              organizationPage?.slug ?? '',
                              selectedReport.slug,
                              chapter.slug,
                            ]).href

                            return (
                              <LinkV2 key={chapter.id} href={href}>
                                <ProfileCard
                                  heightFull={true}
                                  title={chapter.title}
                                  link={{
                                    text:
                                      activeLocale === 'is'
                                        ? 'Skoða'
                                        : 'See more',
                                    url: href,
                                  }}
                                  description={chapter.intro || ''}
                                  image={chapter.thumbnailImage.url}
                                />
                              </LinkV2>
                            )
                          })}
                        </Box>
                      )}
                    </Stack>
                  </GridColumn>
                </GridRow>
              </>
            )}
          </Stack>
        </Stack>
      }
    >
      {organizationPage.organization && (
        <OrganizationFooter organizations={[organizationPage.organization]} />
      )}
    </OrganizationWrapper>
  )
}

AnnualReports.getProps = async ({
  apolloClient,
  locale,
  query,
  organizationPage,
}) => {
  const [organizationPageSlug, annualReportsSlug] = query.slugs as string[]

  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getAnnualReports },
    },
    namespace,
  ] = await Promise.all([
    !organizationPage
      ? apolloClient.query<Query, QueryGetOrganizationPageArgs>({
          query: GET_ORGANIZATION_PAGE_QUERY,
          variables: {
            input: {
              slug: organizationPageSlug,
              lang: locale as ContentLanguage,
              subpageSlugs: [annualReportsSlug],
            },
          },
        })
      : { data: { getOrganizationPage: organizationPage } },
    apolloClient.query<Query, QueryGetAnnualReportsArgs>({
      query: GET_ANNUAL_REPORTS_QUERY,
      variables: {
        input: {
          organizationSlug: organizationPageSlug,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            lang: locale as ContentLanguage,
            namespace: 'OrganizationPages',
          },
        },
      })
      // map data here to reduce data processing in component
      .then((variables) =>
        variables?.data?.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  if (!getAnnualReports) {
    throw new CustomNextError(404, 'Annual Reports not found')
  }

  return {
    organizationPage: getOrganizationPage,
    namespace,
    annualReports: getAnnualReports,
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(AnnualReports)

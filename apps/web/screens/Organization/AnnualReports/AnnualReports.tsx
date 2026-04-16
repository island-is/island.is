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
  HeadWithSocialSharing,
  OrganizationFooter,
  OrganizationHeader,
  Webreader,
} from '@island.is/web/components'
import {
  AnnualReport,
  ContentLanguage,
  OrganizationPage,
  Query,
  QueryGetAnnualReportsArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { linkResolver } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen, ScreenContext } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  GET_ANNUAL_REPORTS_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
} from '../../queries'
import * as styles from './AnnualReports.css'

export interface AnnualReportsProps {
  organizationPage: OrganizationPage
  annualReports: AnnualReport[]
}

type AnnualReportsScreenContext = ScreenContext & {
  organizationPage?: Query['getOrganizationPage']
}

const AnnualReports: Screen<AnnualReportsProps, AnnualReportsScreenContext> = ({
  organizationPage,
  annualReports,
}) => {
  useContentfulId(organizationPage?.id)
  useLocalLinkTypeResolver('annualreports')

  const router = useRouter()
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
    <>
      <HeadWithSocialSharing
        title={`${pageTitle} | ${organizationPage.title}`}
      />
      <Box>
        <OrganizationHeader organizationPage={organizationPage} isSubpage />
      </Box>
      <GridContainer>
        <GridRow>
          <GridColumn
            paddingTop={[2, 2, 9]}
            paddingBottom={[6, 6, 9]}
            span={['12/12', '12/12', '10/12']}
            offset={['0', '0', '1/12']}
            className="rs_read"
          >
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
                    <Text variant="h1" as="h1" marginBottom={2}>
                      {pageTitle}
                    </Text>
                    <Webreader
                      marginTop={0}
                      marginBottom={3}
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
                    <GridColumn
                      span={['12/12', '12/12', '6/12', '6/12', '5/12']}
                    >
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
                        value={dropdownOptions.find(
                          (x) => x.value === selectedId,
                        )}
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
                                const href = linkResolver(
                                  'annualreportchapter',
                                  [
                                    organizationPage?.slug ?? '',
                                    selectedReport.slug,
                                    chapter.slug,
                                  ],
                                ).href

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
          </GridColumn>
        </GridRow>
      </GridContainer>

      {organizationPage.organization && (
        <Box className="rs_read" marginTop="auto">
          <OrganizationFooter
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            organizations={[organizationPage.organization]}
            force={true}
          />
        </Box>
      )}
    </>
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
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  if (!getAnnualReports) {
    throw new CustomNextError(404, 'Annual Reports not found')
  }

  return {
    organizationPage: getOrganizationPage,
    annualReports: getAnnualReports,
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(AnnualReports)

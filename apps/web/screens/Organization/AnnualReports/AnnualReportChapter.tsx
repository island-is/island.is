import React, { useMemo } from 'react'
import slugify from '@sindresorhus/slugify'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import {
  AnchorNavigation,
  getThemeConfig,
  HeadWithSocialSharing,
  OrganizationFooter,
  OrganizationHeader,
  Sticky,
  Webreader,
} from '@island.is/web/components'
import {
  AnnualReport,
  AnnualReportChapter as AnnualReportChapterSchema,
  ContentLanguage,
  OrganizationPage,
  Query,
  QueryGetAnnualReportArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { linkResolver } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen, ScreenContext } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { createNavigation } from '@island.is/web/utils/navigation'
import { webRichText } from '@island.is/web/utils/richText'

import {
  GET_ANNUAL_REPORT_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
} from '../../queries'

export interface AnnualReportChapterProps {
  organizationPage: OrganizationPage
  annualReport: AnnualReport
  annualReportChapter: AnnualReportChapterSchema
}

type AnnualReportChapterScreenContext = ScreenContext & {
  organizationPage?: Query['getOrganizationPage']
}

const AnnualReportChapter: Screen<
  AnnualReportChapterProps,
  AnnualReportChapterScreenContext
> = ({ organizationPage, annualReport, annualReportChapter }) => {
  useContentfulId(organizationPage?.id, annualReport.id, annualReportChapter.id)
  useLocalLinkTypeResolver('annualreportchapter')

  const { activeLocale } = useI18n()

  const navigation = useMemo(() => {
    if (annualReportChapter) {
      const { content, title } = annualReportChapter
      return createNavigation(content, { title })
    }
  }, [annualReportChapter])

  const showNavigation = (navigation?.length ?? 0) > 2

  return (
    <>
      <HeadWithSocialSharing
        title={`${annualReportChapter.title} | ${organizationPage.title}`}
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
                    {
                      title: 'Ársskýrslur',
                      href: linkResolver('annualreport', [
                        organizationPage?.slug ?? '',
                        annualReport.slug,
                      ]).href,
                    },
                  ]}
                />
              </Box>
              <GridRow>
                <GridColumn
                  span={
                    showNavigation
                      ? ['12/12', '12/12', '12/12', '8/12', '9/12']
                      : ['12/12']
                  }
                >
                  <Text variant="h1" as="h1" marginBottom={2}>
                    {annualReportChapter.title}
                  </Text>
                  <Webreader
                    marginTop={0}
                    marginBottom={3}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore make web strict
                    readId={null}
                    readClass="rs_read"
                  />
                  {annualReportChapter.intro && (
                    <Text variant="intro" as="p" paddingTop={2}>
                      <span
                        className="rs_read"
                        id={slugify(annualReportChapter.intro)}
                      >
                        {annualReportChapter.intro}
                      </span>
                    </Text>
                  )}

                  {showNavigation && navigation && (
                    <Box
                      printHidden
                      display={['block', 'block', 'block', 'none']}
                      paddingTop={6}
                      paddingBottom={2}
                    >
                      <AnchorNavigation
                        title={'Á þessari síðu'}
                        navigation={navigation}
                        position="right"
                      />
                    </Box>
                  )}
                  {annualReportChapter.content &&
                    annualReportChapter.content.length > 0 && (
                      <Box paddingY={4}>
                        {webRichText(
                          annualReportChapter.content as SliceType[],
                          undefined,
                          activeLocale,
                        )}
                      </Box>
                    )}
                </GridColumn>
                {showNavigation && navigation && (
                  <GridColumn
                    hiddenBelow="lg"
                    span={['0', '0', '0', '4/12', '3/12']}
                  >
                    <Box
                      printHidden
                      height="full"
                      marginTop={10}
                      paddingLeft={4}
                    >
                      <Sticky>
                        <AnchorNavigation
                          title={'Á þessari síðu'}
                          navigation={navigation}
                          position="right"
                        />
                      </Sticky>
                    </Box>
                  </GridColumn>
                )}
              </GridRow>
            </GridContainer>
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

AnnualReportChapter.getProps = async ({
  apolloClient,
  locale,
  query,
  organizationPage,
}) => {
  const querySlugs = (query.slugs ?? []) as string[]
  const [
    organizationPageSlug,
    _annualReportsPath,
    annualReportSlug,
    annualReportChapterSlug,
  ] = querySlugs

  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getAnnualReport },
    },
  ] = await Promise.all([
    !organizationPage
      ? apolloClient.query<Query, QueryGetOrganizationPageArgs>({
          query: GET_ORGANIZATION_PAGE_QUERY,
          variables: {
            input: {
              slug: organizationPageSlug,
              lang: locale as ContentLanguage,
              subpageSlugs: querySlugs.slice(1),
            },
          },
        })
      : { data: { getOrganizationPage: organizationPage } },
    apolloClient.query<Query, QueryGetAnnualReportArgs>({
      query: GET_ANNUAL_REPORT_QUERY,
      variables: {
        input: {
          organizationSlug: organizationPageSlug,
          annualReportSlug: annualReportSlug,
          lang: locale as ContentLanguage,
        },
      },
    }),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  if (!getAnnualReport) {
    throw new CustomNextError(404, 'Annual Report not found')
  }

  const annualReportChapter = getAnnualReport.chapters.find(
    (chapter) => chapter.slug === annualReportChapterSlug,
  )

  if (!annualReportChapter) {
    throw new CustomNextError(404, 'Annual Report Chapter not found')
  }

  return {
    organizationPage: getOrganizationPage,
    annualReport: getAnnualReport,
    annualReportChapter,
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(AnnualReportChapter)

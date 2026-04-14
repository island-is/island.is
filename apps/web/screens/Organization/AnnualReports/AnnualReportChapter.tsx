import React, { useMemo } from 'react'
import { useRouter } from 'next/router'
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
  OrganizationFooter,
  OrganizationWrapper,
  Sticky,
  Webreader,
} from '@island.is/web/components'
import {
  AnnualReportChapter as AnnualReportChapterSchema,
  ContentLanguage,
  GetNamespaceQuery,
  OrganizationPage,
  Query,
  QueryGetAnnualReportChapterArgs,
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
import { createNavigation } from '@island.is/web/utils/navigation'
import { getOrganizationSidebarNavigationItems } from '@island.is/web/utils/organization'
import { webRichText } from '@island.is/web/utils/richText'

import {
  GET_ANNUAL_REPORT_CHAPTER_QUERY,
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
} from '../../queries'

export interface AnnualReportChapterProps {
  organizationPage: OrganizationPage
  namespace: Record<string, string>
  annualReportChapter: AnnualReportChapterSchema
}

type AnnualReportChapterScreenContext = ScreenContext & {
  organizationPage?: Query['getOrganizationPage']
}

const AnnualReportChapter: Screen<
  AnnualReportChapterProps,
  AnnualReportChapterScreenContext
> = ({ organizationPage, namespace, annualReportChapter }) => {
  useContentfulId(organizationPage?.id, annualReportChapter.id)
  useLocalLinkTypeResolver('annualreportchapter')

  const n = useNamespace(namespace)
  const router = useRouter()
  const baseRouterPath = router.asPath.split('?')[0].split('#')[0]
  const { activeLocale } = useI18n()

  const navigation = useMemo(() => {
    if (annualReportChapter) {
      const { content, title } = annualReportChapter
      return createNavigation(content, { title })
    }
  }, [annualReportChapter])

  const showNavigation = (navigation?.length ?? 0) > 2

  return (
    <OrganizationWrapper
      pageTitle={annualReportChapter.title}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
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
                  href: linkResolver('annualreports', [
                    organizationPage?.slug ?? '',
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
              <Text variant="h1" as="h1" marginBottom={0} marginTop={1}>
                {annualReportChapter.title}
              </Text>
              <Webreader
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
                <Box printHidden height="full" marginTop={10} paddingLeft={4}>
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
      }
    >
      {organizationPage.organization && (
        <OrganizationFooter organizations={[organizationPage.organization]} />
      )}
    </OrganizationWrapper>
  )
}

AnnualReportChapter.getProps = async ({
  apolloClient,
  locale,
  query,
  organizationPage,
}) => {
  const querySlugs = (query.slugs ?? []) as string[]
  const [organizationPageSlug, _, annualReportChapterSlug] = querySlugs

  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getAnnualReportChapter },
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
              subpageSlugs: querySlugs.slice(1),
            },
          },
        })
      : { data: { getOrganizationPage: organizationPage } },
    await apolloClient.query<Query, QueryGetAnnualReportChapterArgs>({
      query: GET_ANNUAL_REPORT_CHAPTER_QUERY,
      variables: {
        input: {
          slug: annualReportChapterSlug,
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

  if (!getAnnualReportChapter) {
    throw new CustomNextError(404, 'Annual Report Chapter not found')
  }

  return {
    organizationPage: getOrganizationPage,
    namespace,
    annualReportChapter: getAnnualReportChapter,
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(AnnualReportChapter)

import React, { useMemo, useState, useEffect } from 'react'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  GetNewsQuery,
  OneColumnText,
  Query,
  QueryGetNamespaceArgs,
  QueryGetProjectPageArgs,
} from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY, GET_NEWS_QUERY } from '../queries'
import { Screen } from '../../types'
import { useNamespace } from '@island.is/web/hooks'
import { CustomNextError } from '@island.is/web/units/errors'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { GET_PROJECT_PAGE_QUERY } from '@island.is/web/screens/queries/Project'
import {
  OrganizationSlice,
  Section,
  HeadWithSocialSharing,
  NewsItems,
  Stepper,
  stepperUtils,
} from '@island.is/web/components'
import {
  Box,
  Hidden,
  Navigation,
  TableOfContents,
  Text,
} from '@island.is/island-ui/core'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { QueryGetNewsArgs } from '@island.is/api/schema'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import slugify from '@sindresorhus/slugify'
import {
  assignNavigationActive,
  convertLinkGroupsToNavigationItems,
  getActiveNavigationItemTitle,
  getThemeConfig,
} from './utils'
import { ProjectHeader } from './components/ProjectHeader'
import { ProjectWrapper } from './components/ProjectWrapper'
import { ProjectChatPanel } from './components/ProjectChatPanel'

interface PageProps {
  projectPage: Query['getProjectPage']
  news: GetNewsQuery['getNews']['items']
  namespace: Query['getNamespace']
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stepOptionsFromNamespace: { data: Record<string, any>[]; slug: string }[]
  stepperNamespace: Query['getNamespace']
}

const ProjectPage: Screen<PageProps> = ({
  projectPage,
  news,
  namespace,
  stepperNamespace,
  stepOptionsFromNamespace,
}) => {
  const n = useNamespace(namespace)
  const router = useRouter()

  const subpage = useMemo(
    () =>
      projectPage.projectSubpages.find((x) => {
        return x.slug === router.query.subSlug
      }),
    [router.query.subSlug, projectPage.projectSubpages],
  )

  useContentfulId(projectPage.id, subpage?.id)

  const baseRouterPath = router.asPath.split('?')[0].split('#')[0]

  const navigationList = useMemo(
    () =>
      assignNavigationActive(
        convertLinkGroupsToNavigationItems(projectPage.sidebarLinks),
        baseRouterPath,
      ),
    [baseRouterPath, projectPage.sidebarLinks],
  )

  const activeNavigationItemTitle = useMemo(
    () => getActiveNavigationItemTitle(navigationList, baseRouterPath),
    [baseRouterPath, navigationList],
  )

  const navigationTitle = n('navigationTitle', 'Efnisyfirlit')

  const renderSlicesAsTabs = subpage?.renderSlicesAsTabs ?? false

  const [selectedSliceTab, setSelectedSliceTab] = useState<
    OneColumnText | undefined
  >(undefined)

  let content: SliceType[] = []
  if (!!subpage && renderSlicesAsTabs)
    content = selectedSliceTab?.content as SliceType[]
  if (!subpage) content = projectPage?.content as SliceType[]

  useEffect(() => {
    if (renderSlicesAsTabs && !!subpage && subpage?.slices?.length > 0) {
      const [, anchorSlug] = router.asPath.split('#')
      const slices = subpage.slices as OneColumnText[]

      let slice = slices[0]

      if (anchorSlug) {
        const anchorSlice = slices.find((s) => anchorSlug === slugify(s.title))
        if (anchorSlice) {
          slice = anchorSlice
        }
      }

      setSelectedSliceTab(slice)
    }
  }, [renderSlicesAsTabs, subpage, router.asPath])

  return (
    <>
      <ProjectChatPanel projectPage={projectPage} />
      <HeadWithSocialSharing
        title={`${projectPage.title} | Ísland.is`}
        description={projectPage.featuredDescription || projectPage.intro}
        imageUrl={projectPage.featuredImage?.url}
        imageContentType={projectPage.featuredImage?.contentType}
        imageWidth={projectPage.featuredImage?.width?.toString()}
        imageHeight={projectPage.featuredImage?.height?.toString()}
      />
      <ProjectHeader projectPage={projectPage} />
      <ProjectWrapper
        withSidebar={projectPage.sidebar}
        sidebarContent={
          <Navigation
            baseId="pageNav"
            items={navigationList}
            activeItemTitle={activeNavigationItemTitle}
            title={navigationTitle}
            renderLink={(link, item) => {
              return item?.href ? (
                <NextLink href={item?.href}>{link}</NextLink>
              ) : (
                link
              )
            }}
          />
        }
      >
        {projectPage.sidebar && (
          <Hidden above="sm">
            <Box>
              <Box marginY={2}>
                <Navigation
                  isMenuDialog
                  baseId="pageNav"
                  items={navigationList}
                  activeItemTitle={activeNavigationItemTitle}
                  title={navigationTitle}
                  renderLink={(link, item) => {
                    return item?.href ? (
                      <NextLink href={item?.href}>{link}</NextLink>
                    ) : (
                      link
                    )
                  }}
                />
              </Box>
            </Box>
          </Hidden>
        )}
        {!!subpage && (
          <Box marginBottom={1}>
            <Text as="h1" variant="h1">
              {subpage.title}
            </Text>
            {subpage.content && richText(subpage.content as SliceType[])}
          </Box>
        )}
        {renderSlicesAsTabs && !!subpage && subpage.slices.length > 1 && (
          <Box marginBottom={2}>
            <TableOfContents
              tableOfContentsTitle={n('tableOfContentsTitle', 'Undirkaflar')}
              headings={subpage.slices.map((slice) => ({
                headingId: slice.id,
                headingTitle: (slice as OneColumnText).title,
              }))}
              selectedHeadingId={selectedSliceTab?.id}
              onClick={(id) => {
                const slice = subpage.slices.find(
                  (s) => s.id === id,
                ) as OneColumnText
                router.push(
                  `${baseRouterPath}#${slugify(slice.title)}`,
                  undefined,
                  { shallow: true },
                )
                setSelectedSliceTab(slice)
              }}
            />
          </Box>
        )}
        {renderSlicesAsTabs && selectedSliceTab && (
          <Text paddingTop={4} as="h2" variant="h2">
            {selectedSliceTab.title}
          </Text>
        )}
        {content && richText(content)}
        {!subpage && projectPage.stepper && (
          <Box marginTop={6}>
            <Stepper
              scrollUpWhenNextStepAppears={false}
              stepper={projectPage.stepper}
              optionsFromNamespace={stepOptionsFromNamespace}
              namespace={stepperNamespace}
            />
          </Box>
        )}
        {!renderSlicesAsTabs &&
          (subpage ?? projectPage).slices.map((slice) => (
            <OrganizationSlice
              key={slice.id}
              slice={slice}
              namespace={namespace}
              fullWidth={true}
              organizationPageSlug={projectPage.slug}
            />
          ))}
      </ProjectWrapper>
      {!subpage && !!projectPage.newsTag && (
        <div style={{ overflow: 'hidden' }}>
          <Section
            paddingTop={[8, 8, 6]}
            paddingBottom={[8, 8, 6]}
            background="purple100"
            aria-labelledby="latestNewsTitle"
          >
            <NewsItems
              heading={n('newsAndAnnouncements')}
              headingTitle="news-items-title"
              seeMoreText={n('seeMore')}
              items={news}
            />
          </Section>
        </div>
      )}
    </>
  )
}

ProjectPage.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getProjectPage },
    },
    namespace,
    stepperNamespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetProjectPageArgs>({
      query: GET_PROJECT_PAGE_QUERY,
      variables: {
        input: {
          slug: query.slug as string,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'ProjectPages',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables.data.getNamespace.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Stepper',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables.data.getNamespace.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  const getNewsQuery = getProjectPage?.newsTag
    ? await apolloClient.query<GetNewsQuery, QueryGetNewsArgs>({
        query: GET_NEWS_QUERY,
        variables: {
          input: {
            size: 3,
            lang: locale as ContentLanguage,
            tag: getProjectPage?.newsTag.slug,
          },
        },
      })
    : null

  const subpage = getProjectPage?.projectSubpages.find(
    (x) => x.slug === query.subSlug,
  )

  if (!getProjectPage || (query.subSlug && !subpage)) {
    throw new CustomNextError(404, 'Project page not found')
  }

  let stepOptionsFromNamespace = []

  if (getProjectPage.stepper) {
    stepOptionsFromNamespace = await stepperUtils.getStepOptionsFromUIConfiguration(
      getProjectPage.stepper,
      apolloClient,
    )
  }

  return {
    projectPage: getProjectPage,
    stepOptionsFromNamespace,
    namespace,
    stepperNamespace,
    news: getNewsQuery?.data.getNews.items,
    showSearchInHeader: false,
    ...getThemeConfig(getProjectPage.theme),
  }
}

export default withMainLayout(ProjectPage)

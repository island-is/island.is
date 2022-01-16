/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  GetNewsQuery,
  Link,
  LinkGroup,
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
  DefaultProjectHeader,
  LatestNewsSectionSlider,
  OrganizationSlice,
  Section,
  Stepper,
  EntryProjectHeader,
  HeadWithSocialSharing,
  ElectionProjectHeader,
} from '@island.is/web/components'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Navigation,
  NavigationItem,
  TableOfContents,
  Text,
} from '@island.is/island-ui/core'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { QueryGetNewsArgs } from '@island.is/api/schema'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { ProjectPage as ProjectPageSchema } from '@island.is/web/graphql/schema'
const lightThemes = ['traveling-to-iceland', 'election']

interface ProjectWrapperProps {
  withSidebar?: boolean
  sidebarContent?: ReactElement
}

const ProjectWrapper: React.FC<ProjectWrapperProps> = ({
  withSidebar = false,
  sidebarContent,
  children,
}) => {
  return withSidebar ? (
    <SidebarLayout isSticky={true} sidebarContent={sidebarContent}>
      {children}
    </SidebarLayout>
  ) : (
    <GridContainer>
      <GridRow>
        <GridColumn
          paddingTop={6}
          paddingBottom={6}
          span={['12/12', '12/12', '10/12']}
          offset={['0', '0', '1/12']}
        >
          {children}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

interface ProjectHeaderProps {
  projectPage: ProjectPageSchema
}

const ProjectHeader = ({ projectPage }: ProjectHeaderProps) => {
  switch (projectPage.theme) {
    case 'traveling-to-iceland':
      return <EntryProjectHeader projectPage={projectPage} />
    case 'election':
      return <ElectionProjectHeader projectPage={projectPage} />
    default:
      return <DefaultProjectHeader projectPage={projectPage} />
  }
}

interface PageProps {
  projectPage: Query['getProjectPage']
  news: GetNewsQuery['getNews']['items']
  namespace: Query['getNamespace']
}

const convertLinksToNavigationItem = (links: Link[]) =>
  links.map(({ text, url }) => {
    return {
      title: text,
      href: url,
      active: false,
    }
  })

const convertLinkGroupsToNavigationItems = (
  linkGroups: LinkGroup[],
): NavigationItem[] =>
  linkGroups.map(({ primaryLink, childrenLinks }) => {
    return {
      title: primaryLink.text,
      href: primaryLink.url,
      active: false,
      items: convertLinksToNavigationItem(childrenLinks),
    }
  })

const getActiveNavigationItemTitle = (
  navigationItems: NavigationItem[],
  clientUrl: string,
) => {
  for (const item of navigationItems) {
    if (clientUrl === item.href) {
      return item.title
    }
    for (const childItem of item.items) {
      if (clientUrl === childItem.href) {
        return childItem.title
      }
    }
  }
}

const assignNavigationActive = (
  items: NavigationItem[],
  clientUrl: string,
): NavigationItem[] =>
  items.map((item) => {
    let isAnyChildActive = false
    const childItems = item.items.map((childItem) => {
      const isChildActive = clientUrl === childItem.href
      if (isChildActive) isAnyChildActive = isChildActive
      return {
        ...childItem,
        active: isChildActive,
      }
    })
    return {
      title: item.title,
      href: item.href,
      active: clientUrl === item.href || isAnyChildActive,
      items: childItems,
    }
  })

const ProjectPage: Screen<PageProps> = ({ projectPage, news, namespace }) => {
  const n = useNamespace(namespace)
  const router = useRouter()
  useContentfulId(projectPage.id)

  const subpage = projectPage.projectSubpages.find((x) => {
    return x.slug === router.query.subSlug
  })

  const navigationList = useMemo(
    () =>
      assignNavigationActive(
        convertLinkGroupsToNavigationItems(projectPage.sidebarLinks),
        router.asPath,
      ),
    [router.asPath, projectPage.sidebarLinks],
  )

  const activeNavigationItemTitle = useMemo(
    () => getActiveNavigationItemTitle(navigationList, router.asPath),
    [router.asPath, navigationList],
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
    if (renderSlicesAsTabs && !!subpage && subpage?.slices?.length > 0)
      setSelectedSliceTab(subpage.slices[0] as OneColumnText)
  }, [router.asPath])

  return (
    <>
      <HeadWithSocialSharing
        title={`${projectPage.title} | Ísland.is`}
        description={projectPage.intro}
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
        {!!subpage && (
          <>
            <Text as="h1" variant="h1">
              {subpage.title}
            </Text>
            {subpage.content && richText(subpage.content as SliceType[])}
          </>
        )}
        {renderSlicesAsTabs && !!subpage && subpage.slices.length > 1 && (
          <TableOfContents
            tableOfContentsTitle="Undirkaflar"
            headings={subpage.slices.map((slice) => ({
              headingId: slice.id,
              headingTitle: (slice as OneColumnText).title,
            }))}
            selectedHeadingId={selectedSliceTab?.id}
            onClick={(id) =>
              setSelectedSliceTab(
                subpage.slices.find((s) => s.id === id) as OneColumnText,
              )
            }
          />
        )}
        {renderSlicesAsTabs && selectedSliceTab && (
          <Text paddingTop={4} as="h2" variant="h2">
            {selectedSliceTab.title}
          </Text>
        )}
        {content && richText(content)}
        {!subpage && projectPage.stepper && (
          <Stepper
            stepper={projectPage.stepper}
            startAgainLabel={n('stepperStartAgain', 'Byrja upp á nýtt')}
            answerLabel={n('stepperAnswer', 'Niðurstaða byggð á þínum svörum')}
            backLabel={n('stepperBack', 'Til baka')}
          />
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
            <LatestNewsSectionSlider
              label={n('newsAndAnnouncements')}
              readMoreText={n('seeMore')}
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
            namespace: 'Syslumenn',
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

  const isLightTheme = lightThemes.includes(getProjectPage.theme)

  return {
    projectPage: getProjectPage,
    namespace,
    news: getNewsQuery?.data.getNews.items,
    showSearchInHeader: false,
    ...(isLightTheme ? {} : { darkTheme: true }),
  }
}

export default withMainLayout(ProjectPage)

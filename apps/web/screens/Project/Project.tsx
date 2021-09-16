/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { ReactElement } from 'react'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  GetNewsQuery,
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
  GridColumn,
  GridContainer,
  GridRow,
  Navigation,
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

const ProjectPage: Screen<PageProps> = ({ projectPage, news, namespace }) => {
  const n = useNamespace(namespace)
  const router = useRouter()
  useContentfulId(projectPage.id)

  const subpage = projectPage.projectSubpages.find((x) => {
    return x.slug === router.query.subSlug
  })

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
          <>
            <Navigation
              baseId="pageNav"
              items={projectPage.sidebarLinks?.map(({ text, url }) => ({
                title: text,
                href: url,
                active: router.asPath === url,
              }))}
              title="Efnisyfirlit"
              renderLink={(link, item) => {
                return item?.href ? (
                  <NextLink href={item?.href}>{link}</NextLink>
                ) : (
                  link
                )
              }}
            />
          </>
        }
      >
        {!!subpage && (
          <Text as="h1" variant="h1">
            {subpage.title}
          </Text>
        )}
        {richText((subpage ?? projectPage).content as SliceType[])}
        {!subpage && projectPage.stepper && (
          <Stepper
            stepper={projectPage.stepper}
            startAgainLabel={n('stepperStartAgain', 'Byrja upp á nýtt')}
            answerLabel={n('stepperAnswer', 'Niðurstaða byggð á þínum svörum')}
            backLabel={n('stepperBack', 'Til baka')}
          />
        )}
        {(subpage ?? projectPage).slices.map((slice) => (
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

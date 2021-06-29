/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { ReactElement, useEffect, useMemo, useState } from 'react'
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
} from '@island.is/web/components'
import Head from 'next/head'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Inline,
  Navigation,
  Text,
} from '@island.is/island-ui/core'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { QueryGetNewsArgs } from '@island.is/api/schema'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

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

interface PageProps {
  projectPage: Query['getProjectPage']
  news: GetNewsQuery['getNews']['items']
  namespace: Query['getNamespace']
}

const ProjectPage: Screen<PageProps> = ({ projectPage, news, namespace }) => {
  const n = useNamespace(namespace)
  const router = useRouter()
  useContentfulId(projectPage.id)

  const [step, setStep] = useState('')

  const currentStep = useMemo(
    () =>
      projectPage.stepper?.steps.find((x) => x.slug === step) ??
      projectPage.stepper?.steps[0],
    [step],
  )

  const subpage = projectPage.projectSubpages.find((x) => {
    return x.slug === router.query.subSlug
  })

  return (
    <>
      <Head>
        <title>{projectPage.title} | Ísland.is</title>
      </Head>
      <DefaultProjectHeader projectPage={projectPage} />
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
        {projectPage.stepper && (
          <Box style={{ minHeight: 400 }}>
            <GridContainer>
              <GridRow>
                <GridColumn span={['12/12', '12/12', '5/12']}>
                  <Text variant="h2">{currentStep.title}</Text>
                  <GridContainer>
                    <GridRow marginTop={8}>
                      {JSON.parse(currentStep.options).map((x) => (
                        <GridColumn span={['12/12', '12/12', '6/12']}>
                          <Button
                            key={`${currentStep.slug}-${x.key}`}
                            fluid
                            variant="ghost"
                            onClick={() => setStep(x.nextStep)}
                          >
                            {x.label}
                          </Button>
                        </GridColumn>
                      ))}
                    </GridRow>
                  </GridContainer>
                </GridColumn>
                <GridColumn
                  span={['12/12', '12/12', '6/12']}
                  offset={['0', '0', '1/12']}
                >
                  {richText(currentStep.text as SliceType[])}
                </GridColumn>
              </GridRow>
            </GridContainer>
          </Box>
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
      {!subpage && (
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
    {
      data: {
        getNews: { items: news },
      },
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
    apolloClient.query<GetNewsQuery, QueryGetNewsArgs>({
      query: GET_NEWS_QUERY,
      variables: {
        input: {
          size: 3,
          lang: locale as ContentLanguage,
          tag: 'stafraent',
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

  const subpage = getProjectPage?.projectSubpages.find(
    (x) => x.slug === query.subSlug,
  )

  if (!getProjectPage || (query.subSlug && !subpage)) {
    throw new CustomNextError(404, 'Project page not found')
  }

  return {
    projectPage: getProjectPage,
    namespace,
    news,
    showSearchInHeader: false,
    darkTheme: true,
  }
}

export default withMainLayout(ProjectPage)

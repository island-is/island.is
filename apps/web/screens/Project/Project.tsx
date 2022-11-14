import { useMemo, useState, useEffect } from 'react'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  OneColumnText,
  Query,
  QueryGetNamespaceArgs,
  QueryGetProjectPageArgs,
} from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY } from '../queries'
import { Screen } from '../../types'
import { linkResolver, useNamespace } from '@island.is/web/hooks'
import { CustomNextError } from '@island.is/web/units/errors'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { GET_PROJECT_PAGE_QUERY } from '@island.is/web/screens/queries/Project'
import {
  SliceMachine,
  HeadWithSocialSharing,
  Stepper,
  stepperUtils,
  Form,
  PowerBiSlice,
  AccordionSlice,
  TableSlice,
  EmailSignup,
} from '@island.is/web/components'
import {
  Box,
  BreadCrumbItem,
  TableOfContents,
  Text,
} from '@island.is/island-ui/core'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { useRouter } from 'next/router'
import slugify from '@sindresorhus/slugify'
import { getThemeConfig } from './utils'
import { ProjectWrapper } from './components/ProjectWrapper'
import { Locale } from 'locale'
import { ProjectFooter } from './components/ProjectFooter'

interface PageProps {
  projectPage: Query['getProjectPage']
  namespace: Record<string, string>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stepOptionsFromNamespace: { data: Record<string, any>[]; slug: string }[]
  stepperNamespace: Record<string, string>
  locale: Locale
}

const ProjectPage: Screen<PageProps> = ({
  projectPage,
  namespace,
  stepperNamespace,
  stepOptionsFromNamespace,
  locale,
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

  const navigationTitle = n('navigationTitle', 'Efnisyfirlit')

  const renderSlicesAsTabs = subpage?.renderSlicesAsTabs ?? false

  const [selectedSliceTab, setSelectedSliceTab] = useState<
    OneColumnText | undefined
  >(undefined)

  let content: SliceType[] = []
  if (!!subpage && renderSlicesAsTabs) {
    content = selectedSliceTab?.content as SliceType[]
  }
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

  const breadCrumbs: BreadCrumbItem[] = !subpage
    ? []
    : [
        {
          title: 'Ísland.is',
          href: linkResolver('homepage', [], locale).href,
          typename: 'homepage',
        },
        {
          title: projectPage.title,
          href: linkResolver('projectpage', [projectPage.slug], locale).href,
          typename: 'projectpage',
        },
      ]

  return (
    <>
      <HeadWithSocialSharing
        title={`${projectPage.title} | Ísland.is`}
        description={projectPage.featuredDescription || projectPage.intro}
        imageUrl={projectPage.featuredImage?.url}
        imageContentType={projectPage.featuredImage?.contentType}
        imageWidth={projectPage.featuredImage?.width?.toString()}
        imageHeight={projectPage.featuredImage?.height?.toString()}
      />
      <ProjectWrapper
        projectPage={projectPage}
        breadcrumbItems={breadCrumbs}
        sidebarNavigationTitle={navigationTitle}
        withSidebar={projectPage.sidebar}
      >
        {!!subpage && (
          <Box marginBottom={1}>
            <Text as="h1" variant="h1">
              {subpage.title}
            </Text>
            {subpage.content &&
              richText(subpage.content as SliceType[], {
                renderComponent: {
                  Form: (slice) => <Form form={slice} namespace={namespace} />,
                  PowerBiSlice: (slice) => <PowerBiSlice slice={slice} />,
                  AccordionSlice: (slice) => <AccordionSlice slice={slice} />,
                  TableSlice: (slice) => <TableSlice slice={slice} />,
                  EmailSignup: (slice) => <EmailSignup slice={slice} />,
                },
              })}
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
        {content &&
          richText(content, {
            renderComponent: {
              Form: (slice) => <Form form={slice} namespace={namespace} />,
              PowerBiSlice: (slice) => <PowerBiSlice slice={slice} />,
              AccordionSlice: (slice) => <AccordionSlice slice={slice} />,
              TableSlice: (slice) => <TableSlice slice={slice} />,
              EmailSignup: (slice) => <EmailSignup slice={slice} />,
            },
          })}
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
          (subpage ?? projectPage).slices.map((slice) =>
            slice.__typename === 'OneColumnText' ? (
              <Box marginTop={6}>
                <SliceMachine
                  key={slice.id}
                  slice={slice}
                  namespace={namespace}
                  fullWidth={true}
                  slug={projectPage.slug}
                />
              </Box>
            ) : (
              <SliceMachine
                key={slice.id}
                slice={slice}
                namespace={namespace}
                fullWidth={true}
                slug={projectPage.slug}
              />
            ),
          )}
      </ProjectWrapper>
      {!subpage &&
        projectPage.bottomSlices.map((slice) => {
          return (
            <SliceMachine
              key={slice.id}
              slice={slice}
              namespace={namespace}
              slug={projectPage.slug}
              fullWidth={true}
              params={{
                linkType: 'projectnews',
                overview: 'projectnewsoverview',
              }}
            />
          )
        })}
      <ProjectFooter projectPage={projectPage} />
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
    showSearchInHeader: false,
    locale: locale as Locale,
    ...getThemeConfig(getProjectPage.theme),
  }
}

export default withMainLayout(ProjectPage)

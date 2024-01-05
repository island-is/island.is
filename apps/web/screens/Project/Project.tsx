import { useEffect, useMemo, useState } from 'react'
import { Locale } from 'locale'
import { useRouter } from 'next/router'
import slugify from '@sindresorhus/slugify'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  BreadCrumbItem,
  Stack,
  TableOfContents,
  Text,
} from '@island.is/island-ui/core'
import {
  Form,
  HeadWithSocialSharing,
  OneColumnTextSlice,
  SliceMachine,
  Stepper,
  stepperUtils,
  TabSectionSlice,
  Webreader,
} from '@island.is/web/components'
import {
  ContentLanguage,
  OneColumnText,
  Query,
  QueryGetNamespaceArgs,
  QueryGetProjectPageArgs,
  Slice,
  Stepper as StepperSchema,
} from '@island.is/web/graphql/schema'
import { linkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { withMainLayout } from '@island.is/web/layouts/main'
import { GET_PROJECT_PAGE_QUERY } from '@island.is/web/screens/queries/Project'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import { Screen } from '../../types'
import { GET_NAMESPACE_QUERY } from '../queries'
import { ProjectFooter } from './components/ProjectFooter'
import { ProjectWrapper } from './components/ProjectWrapper'
import { TOC } from './ProjectTableOfContents'
import { getThemeConfig } from './utils'

interface PageProps {
  projectPage: Query['getProjectPage']
  namespace: Record<string, string>
  projectNamespace: Record<string, string>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stepOptionsFromNamespace: { data: Record<string, any>[]; slug: string }[]
  stepperNamespace: Record<string, string>
  locale: Locale
}
const ProjectPage: Screen<PageProps> = ({
  projectPage,
  namespace,
  projectNamespace,
  stepperNamespace,
  stepOptionsFromNamespace,
  locale,
}) => {
  const n = useNamespace(namespace)
  const p = useNamespace(projectNamespace)

  const router = useRouter()

  const subpage = useMemo(
    () =>
      projectPage?.projectSubpages.find((x) => {
        return x.slug === router.query.subSlug
      }),
    [router.query.subSlug, projectPage?.projectSubpages],
  )

  useContentfulId(projectPage?.id, subpage?.id)

  const baseRouterPath = router.asPath.split('?')[0].split('#')[0]

  const navigationTitle = p(
    'navigationTitle',
    n('navigationTitle', 'Efnisyfirlit'),
  )

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
          title: projectPage?.title ?? '',
          href: linkResolver('projectpage', [projectPage?.slug ?? ''], locale)
            .href,
          typename: 'projectpage',
        },
      ]

  const bottomSlices =
    (!subpage ? projectPage?.bottomSlices : subpage.bottomSlices) ?? []

  const shouldDisplayWebReader =
    projectNamespace?.shouldDisplayWebReader ?? true

  return (
    <>
      <HeadWithSocialSharing
        title={`${projectPage?.title} | Ísland.is`}
        description={projectPage?.featuredDescription || projectPage?.intro}
        imageUrl={projectPage?.featuredImage?.url}
        imageContentType={projectPage?.featuredImage?.contentType}
        imageWidth={projectPage?.featuredImage?.width?.toString()}
        imageHeight={projectPage?.featuredImage?.height?.toString()}
      />
      <ProjectWrapper
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        projectPage={projectPage}
        breadcrumbItems={breadCrumbs}
        sidebarNavigationTitle={navigationTitle}
        withSidebar={projectPage?.sidebar}
      >
        {!subpage && shouldDisplayWebReader && (
          <Webreader
            marginTop={0}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            readId={null}
            readClass="rs_read"
          />
        )}
        {!!subpage && (
          <Box marginBottom={1} className="rs_read">
            <Text as="h1" variant="h1">
              {subpage.title}
            </Text>
            {shouldDisplayWebReader && (
              <Webreader
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                readId={null}
                readClass="rs_read"
              />
            )}
            {subpage.showTableOfContents && (
              <Box className="rs_read">
                <TOC slices={subpage.slices} title={navigationTitle} />
              </Box>
            )}
            {subpage.content && (
              <Box className="rs_read">
                {webRichText(subpage.content as SliceType[], {
                  renderComponent: {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore make web strict
                    Form: (slice) => (
                      <Form form={slice} namespace={namespace} />
                    ),
                  },
                })}
              </Box>
            )}
          </Box>
        )}
        {renderSlicesAsTabs && !!subpage && subpage.slices.length > 1 && (
          <Box marginBottom={2} className="rs_read">
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
          <Box className="rs_read">
            <Text paddingTop={4} as="h2" variant="h2">
              {selectedSliceTab.title}
            </Text>
          </Box>
        )}
        {content && (
          <Box className="rs_read" paddingBottom={3}>
            {webRichText(content, {
              renderComponent: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                Form: (slice) => <Form form={slice} namespace={namespace} />,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                TabSection: (slice) => (
                  <TabSectionSlice
                    slice={slice}
                    contentColumnProps={{ span: '1/1' }}
                    contentPaddingTop={0}
                  />
                ),
              },
            })}
          </Box>
        )}
        {!subpage && projectPage?.stepper && (
          <Box marginTop={6} className="rs_read">
            <Stepper
              scrollUpWhenNextStepAppears={false}
              stepper={projectPage.stepper}
              optionsFromNamespace={stepOptionsFromNamespace}
              namespace={stepperNamespace}
            />
          </Box>
        )}
        {!renderSlicesAsTabs && (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict

          <Stack space={3}>
            {(subpage ?? projectPage)?.slices.map((slice: Slice) =>
              slice.__typename === 'OneColumnText' ? (
                <Box paddingTop={3} className="rs_read">
                  <SliceMachine
                    key={slice.id}
                    slice={slice}
                    namespace={namespace}
                    fullWidth={true}
                    slug={projectPage?.slug}
                  />
                </Box>
              ) : (
                <Box className="rs_read">
                  <SliceMachine
                    key={slice.id}
                    slice={slice}
                    namespace={namespace}
                    fullWidth={true}
                    slug={projectPage?.slug}
                  />
                </Box>
              ),
            )}
          </Stack>
        )}
      </ProjectWrapper>

      {bottomSlices.map((slice, index) => {
        if (
          slice.__typename === 'OneColumnText' &&
          index === bottomSlices.length - 1
        ) {
          return (
            <Box paddingBottom={6} paddingTop={2}>
              <OneColumnTextSlice slice={slice} />
            </Box>
          )
        }
        return (
          <SliceMachine
            key={slice.id}
            slice={slice}
            namespace={namespace}
            slug={projectPage?.slug}
            fullWidth={true}
            params={{
              linkType: 'projectnews',
              overview: 'projectnewsoverview',
              containerPaddingBottom: 0,
              containerPaddingTop: 0,
              contentPaddingTop: 0,
              contentPaddingBottom: 0,
            }}
            wrapWithGridContainer={
              slice.__typename === 'ConnectedComponent' ||
              slice.__typename === 'TabSection' ||
              slice.__typename === 'PowerBiSlice'
            }
          />
        )
      })}
      <ProjectFooter
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        projectPage={projectPage}
        namespace={projectNamespace}
      />
    </>
  )
}

ProjectPage.getProps = async ({ apolloClient, locale, query }) => {
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
        variables.data.getNamespace?.fields
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
        variables.data.getNamespace?.fields
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

  let stepOptionsFromNamespace: any = []

  if (getProjectPage.stepper) {
    stepOptionsFromNamespace =
      await stepperUtils.getStepOptionsFromUIConfiguration(
        getProjectPage.stepper as StepperSchema,
        apolloClient,
      )
  }

  const projectNamespace = JSON.parse(getProjectPage.namespace?.fields || '{}')

  return {
    projectPage: getProjectPage,
    stepOptionsFromNamespace,
    namespace,
    projectNamespace,
    stepperNamespace,
    showSearchInHeader: false,
    locale: locale as Locale,
    ...getThemeConfig(getProjectPage),
  }
}

export default withMainLayout(ProjectPage)

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import slugify from '@sindresorhus/slugify'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  BreadCrumbItem,
  LinkV2,
  Stack,
  TableOfContents,
  Text,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import {
  DigitalIcelandLatestNewsSlice,
  HeadWithSocialSharing,
  OneColumnTextSlice,
  SliceMachine,
  Stepper,
  stepperUtils,
  TabSectionSlice,
  TOC,
  Webreader,
} from '@island.is/web/components'
import { SLICE_SPACING } from '@island.is/web/constants'
import {
  ContentLanguage,
  OneColumnText,
  ProjectParentSubpage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetProjectPageArgs,
  QueryGetProjectParentSubpageArgs,
  Slice,
  Stepper as StepperSchema,
} from '@island.is/web/graphql/schema'
import { linkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  GET_PROJECT_PAGE_QUERY,
  GET_PROJECT_PARENT_SUBPAGE_QUERY,
} from '@island.is/web/screens/queries/Project'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import { Screen } from '../../types'
import { GET_NAMESPACE_QUERY } from '../queries'
import { ProjectFooter } from './components/ProjectFooter'
import { ProjectWrapper } from './components/ProjectWrapper'
import {
  getProjectEventsOrganizationSlug,
  getThemeConfig,
  projectEventLinkParams,
} from './utils'

export interface PageProps {
  projectPage: Query['getProjectPage']
  namespace: Record<string, string>
  projectNamespace: Record<string, string>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stepOptionsFromNamespace: { data: Record<string, any>[]; slug: string }[]
  stepperNamespace: Record<string, string>
  locale: Locale
  backLink?: { url: string; text: string }
  customContentfulIds?: (string | undefined)[]
  customBreadcrumbItems?: BreadCrumbItem[]
  customContent?: React.ReactNode
  parentSubpage?: ProjectParentSubpage | null
  // Slug of the parent subpage chapter being viewed
  chapterSlug?: string
}
const ProjectPage: Screen<PageProps> = ({
  projectPage,
  namespace,
  projectNamespace,
  stepperNamespace,
  stepOptionsFromNamespace,
  locale,
  backLink,
  customContentfulIds,
  customBreadcrumbItems,
  customContent,
  parentSubpage,
  chapterSlug,
}) => {
  const n = useNamespace(namespace)
  const p = useNamespace(projectNamespace)
  const { activeLocale } = useI18n()
  const { format } = useDateUtils()

  const router = useRouter()

  const subpageSlug = parentSubpage ? chapterSlug : router.query.subSlug

  const subpage = useMemo(
    () =>
      projectPage?.projectSubpages.find((x) => {
        return x.slug === subpageSlug
      }),
    [subpageSlug, projectPage?.projectSubpages],
  )

  const contentfulIds = customContentfulIds
    ? customContentfulIds
    : [projectPage?.id, parentSubpage?.id, subpage?.id]

  useContentfulId(...contentfulIds)
  useLocalLinkTypeResolver(
    parentSubpage ? 'projectparentsubpagechild' : undefined,
  )

  // Only link events to the project event routes when they can resolve an organization
  const eventLinkParams = getProjectEventsOrganizationSlug(projectPage)
    ? projectEventLinkParams
    : undefined

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

  const breadCrumbs: BreadCrumbItem[] = customBreadcrumbItems
    ? customBreadcrumbItems
    : !subpage
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

  const pageSlices = (subpage ?? projectPage)?.slices ?? []

  const mainContent = (
    <>
      {!subpage && shouldDisplayWebReader && (
        <Webreader
          marginTop={0}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          readId={null}
          readClass="rs_read"
        />
      )}
      {!!parentSubpage && (
        <Box marginBottom={4} className="rs_read">
          <Stack space={4}>
            <Text as="h1" variant="h1">
              {parentSubpage.title}
            </Text>
            {parentSubpage.childLinks.length > 1 && (
              <Box
                paddingX={4}
                paddingY={2}
                borderLeftWidth="standard"
                borderColor="blue200"
              >
                <Stack space={1}>
                  <Text variant="h5" as="h2">
                    {p(
                      'parentSubpageTableOfContentsTitle',
                      activeLocale === 'is' ? 'Á þessari síðu' : 'On this page',
                    )}
                  </Text>
                  <Stack space={1}>
                    {parentSubpage.childLinks.map((link) => {
                      const isSelected =
                        link.href.split('/').pop() === chapterSlug
                      return (
                        <LinkV2 key={link.href} href={link.href}>
                          <Text
                            variant="small"
                            fontWeight={isSelected ? 'semiBold' : 'regular'}
                            color={isSelected ? 'blue400' : 'blue600'}
                          >
                            {link.label}
                          </Text>
                        </LinkV2>
                      )
                    })}
                  </Stack>
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>
      )}
      {!!subpage && (
        <Box marginBottom={1} className="rs_read">
          <Text
            as={parentSubpage ? 'h2' : 'h1'}
            variant={parentSubpage ? 'h2' : 'h1'}
          >
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
            <Box marginY={6} className="rs_read">
              <TOC slices={subpage.slices} title={navigationTitle} />
            </Box>
          )}
          {subpage.content && (
            <Box className="rs_read">
              {webRichText(
                subpage.content as SliceType[],
                undefined,
                activeLocale,
              )}
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
      {content?.length > 0 && (
        <Box className="rs_read" paddingBottom={SLICE_SPACING}>
          {webRichText(content, {
            renderComponent: {
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
      {!renderSlicesAsTabs && pageSlices.length > 0 && (
        <Stack space={SLICE_SPACING}>
          {pageSlices.map((slice: Slice, index) => {
            const sliceCount = pageSlices.length
            return (
              <Box className="rs_read" key={slice.id}>
                <SliceMachine
                  slice={slice}
                  namespace={namespace}
                  fullWidth={true}
                  slug={projectPage?.slug}
                  params={eventLinkParams}
                  marginBottom={
                    typeof sliceCount === 'number' && index === sliceCount - 1
                      ? 8
                      : 0
                  }
                />
              </Box>
            )
          })}
        </Stack>
      )}
      {!!subpage &&
        subpage.showDateOfTheMostRecentReview &&
        subpage.contentLastReviewed && (
          <Box paddingTop={2} className="rs_read">
            <Text variant="small">
              {`${n(
                'contentLastReviewedLabel',
                activeLocale === 'is' ? 'Síðast uppfært' : 'Last updated',
              )}: ${format(
                new Date(subpage.contentLastReviewed),
                'do MMMM yyyy',
              )}`}
            </Text>
          </Box>
        )}
    </>
  )

  return (
    <>
      <HeadWithSocialSharing
        title={`${
          parentSubpage && subpage
            ? `${parentSubpage.title} - ${subpage.title}`
            : subpage?.title ?? projectPage?.title
        } | Ísland.is`}
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
        backLink={backLink}
        isSubpage={(subpage && p('smallerSubpageHeader', false)) ?? false}
        isFrontpage={!subpage}
      >
        {customContent ? customContent : mainContent}
      </ProjectWrapper>

      <Stack
        space={bottomSlices && bottomSlices.length > 0 ? SLICE_SPACING : 0}
      >
        {bottomSlices.map((slice, index) => {
          if (
            slice.__typename === 'OneColumnText' &&
            index === bottomSlices.length - 1
          ) {
            return (
              <Box paddingBottom={6}>
                <OneColumnTextSlice slice={slice} />
              </Box>
            )
          }
          if (slice.__typename === 'LatestNewsSlice' && projectPage?.slug) {
            return (
              <Box paddingBottom={[2, 2, 5]} key={slice.id}>
                <DigitalIcelandLatestNewsSlice
                  slice={slice}
                  slug={projectPage.slug}
                  seeMoreLinkVariant="project"
                />
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
                ...eventLinkParams,
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
      </Stack>
      <Box marginTop="auto">
        <ProjectFooter
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          projectPage={projectPage}
          namespace={projectNamespace}
        />
      </Box>
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
          subpageSlug: query.subSlug as string | undefined,
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

  if (!getProjectPage) {
    throw new CustomNextError(404, 'Project page not found')
  }

  let projectPage = getProjectPage
  let parentSubpage: ProjectParentSubpage | null = null
  let chapterSlug: string | undefined = undefined

  const subpage = getProjectPage.projectSubpages.find(
    (x) => x.slug === query.subSlug,
  )

  if (query.subSlug && !subpage) {
    // The slug might belong to a parent subpage that groups several subpages (chapters) together
    parentSubpage =
      (
        await apolloClient.query<Query, QueryGetProjectParentSubpageArgs>({
          query: GET_PROJECT_PARENT_SUBPAGE_QUERY,
          variables: {
            input: {
              slug: query.subSlug as string,
              projectPageSlug: query.slug as string,
              lang: locale as ContentLanguage,
            },
          },
        })
      ).data.getProjectParentSubpage ?? null

    if (!parentSubpage) {
      throw new CustomNextError(404, 'Project subpage not found')
    }

    // Show the first chapter if none is selected
    const chapterLink = query.genericListItemSlug
      ? parentSubpage.childLinks.find(
          (link) => link.href.split('/').pop() === query.genericListItemSlug,
        )
      : parentSubpage.childLinks[0]

    chapterSlug = chapterLink?.href.split('/').pop()

    if (!chapterSlug) {
      throw new CustomNextError(
        404,
        'Subpage belonging to a project parent subpage was not found',
      )
    }

    const chapterResponse = await apolloClient.query<
      Query,
      QueryGetProjectPageArgs
    >({
      query: GET_PROJECT_PAGE_QUERY,
      variables: {
        input: {
          slug: query.slug as string,
          lang: locale as ContentLanguage,
          subpageSlug: chapterSlug,
        },
      },
    })

    const chapterProjectPage = chapterResponse.data.getProjectPage

    if (
      !chapterProjectPage?.projectSubpages.some((x) => x.slug === chapterSlug)
    ) {
      throw new CustomNextError(
        404,
        'Subpage belonging to a project parent subpage was not found',
      )
    }

    projectPage = chapterProjectPage
  }

  let stepOptionsFromNamespace: any = []

  if (projectPage.stepper) {
    stepOptionsFromNamespace =
      await stepperUtils.getStepOptionsFromUIConfiguration(
        projectPage.stepper as StepperSchema,
        apolloClient,
      )
  }

  const projectNamespace = JSON.parse(projectPage.namespace?.fields || '{}')

  return {
    projectPage,
    parentSubpage,
    chapterSlug,
    stepOptionsFromNamespace,
    namespace,
    projectNamespace,
    stepperNamespace,
    showSearchInHeader: false,
    locale: locale as Locale,
    customAlertBanner: projectPage?.alertBanner,
    ...getThemeConfig(projectPage),
  }
}

export default withMainLayout(ProjectPage)

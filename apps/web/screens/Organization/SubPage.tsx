import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  BreadCrumbItem,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  NavigationItem,
  Stack,
  TableOfContents,
  Text,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import {
  getThemeConfig,
  OrganizationWrapper,
  SignLanguageButton,
  SliceDropdown,
  SliceMachine,
  SliceTableOfContents,
  TOC,
  Webreader,
} from '@island.is/web/components'
import { SLICE_SPACING } from '@island.is/web/constants'
import {
  ContentLanguage,
  OrganizationParentSubpage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryGetOrganizationParentSubpageArgs,
  QueryGetOrganizationSubpageArgs,
  Slice,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'
import { safelyExtractPathnameFromUrl } from '@island.is/web/utils/safelyExtractPathnameFromUrl'

import { Screen } from '../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_PARENT_SUBPAGE_QUERY,
  GET_ORGANIZATION_SUBPAGE_QUERY,
} from '../queries'

export interface SubPageProps {
  organizationPage: Query['getOrganizationPage']
  subpage: Query['getOrganizationSubpage']
  namespace: Record<string, string>
  locale: Locale
  customContent?: React.ReactNode
  backLink?: { text: string; url: string }
  customBreadcrumbItems?: BreadCrumbItem[]
  customContentfulIds?: (string | undefined)[]
  parentSubpageProps?: {
    tableOfContentHeadings: {
      headingId: string
      headingTitle: string
      label: string
      href: string
    }[]
    selectedHeadingId: string
    parentSubpage: OrganizationParentSubpage
  }
}

const SubPageContent = ({
  subpage,
  namespace,
  organizationPage,
}: Pick<SubPageProps, 'subpage' | 'organizationPage' | 'namespace'>) => {
  const n = useNamespace(namespace)
  const { activeLocale } = useI18n()
  const content = (
    <>
      {subpage?.showTableOfContents && (
        <Box marginY={2}>
          <TOC
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            slices={subpage.slices}
            title={n('navigationTitle', 'Efnisyfirlit')}
          />
        </Box>
      )}
      <GridRow className="rs_read">
        {subpage?.description && subpage.description.length > 0 && (
          <GridColumn
            span={['12/12', '12/12', subpage?.links?.length ? '7/12' : '12/12']}
            paddingBottom={3}
          >
            {webRichText(
              subpage?.description as SliceType[],
              undefined,
              activeLocale,
            )}
          </GridColumn>
        )}
        {subpage?.links && subpage.links.length > 0 && (
          <GridColumn
            span={['12/12', '12/12', '4/12']}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            offset={[null, null, '1/12']}
            paddingBottom={3}
          >
            <Stack space={2}>
              {subpage?.links?.map((link) => (
                <Link href={link.url} underline="small">
                  <Text fontWeight="light" color="blue400">
                    {link.text}
                  </Text>
                </Link>
              ))}
            </Stack>
          </GridColumn>
        )}
      </GridRow>
    </>
  )
  return (
    <>
      <GridContainer>
        <Box paddingTop={4}>
          <GridRow>
            <GridColumn span={['9/9', '9/9', '7/9']} offset={['0', '0', '1/9']}>
              <GridContainer>
                <GridRow>
                  <GridColumn
                    span={[
                      '12/12',
                      '12/12',
                      subpage?.links?.length ? '7/12' : '12/12',
                    ]}
                  >
                    <>
                      <Box className="rs_read" marginBottom={2}>
                        <Text variant="h1" as="h1">
                          {subpage?.title}
                        </Text>
                      </Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        columnGap={2}
                        rowGap={2}
                        marginBottom={3}
                        flexWrap="wrap"
                      >
                        <Webreader
                          marginTop={0}
                          marginBottom={0}
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore make web strict
                          readId={null}
                          readClass="rs_read"
                        />
                        {subpage?.signLanguageVideo?.url && (
                          <SignLanguageButton
                            videoUrl={subpage.signLanguageVideo.url}
                            videoThumbnailImageUrl={
                              subpage.signLanguageVideo.thumbnailImageUrl
                            }
                            content={
                              <>
                                <Box className="rs_read" marginBottom={2}>
                                  <Text variant="h2">{subpage.title}</Text>
                                </Box>
                                {content}
                                {renderSlices(
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore make web strict
                                  subpage.slices,
                                  subpage.sliceCustomRenderer,
                                  subpage.sliceExtraText,
                                  namespace,
                                  organizationPage?.slug,
                                )}
                              </>
                            }
                          />
                        )}
                      </Box>
                    </>
                  </GridColumn>
                </GridRow>
                {content}
              </GridContainer>
            </GridColumn>
          </GridRow>
        </Box>
      </GridContainer>
      <Stack space={SLICE_SPACING}>
        {renderSlices(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          subpage.slices,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          subpage.sliceCustomRenderer,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          subpage.sliceExtraText,
          namespace,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          organizationPage.slug,
        )}
      </Stack>
    </>
  )
}

const Default = ({
  organizationPage,
  subpage,
  namespace,
  locale,
  customContent,
  customBreadcrumbItems,
  customContentfulIds,
  backLink,
}: SubPageProps) => {
  const router = useRouter()

  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  const contentfulIds = customContentfulIds
    ? customContentfulIds
    : [organizationPage?.id, subpage?.id]

  useContentfulId(...contentfulIds)

  const pathname = new URL(router.asPath, 'https://island.is').pathname
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const navList: NavigationItem[] = organizationPage?.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink?.text,
      href: primaryLink?.url,
      active:
        primaryLink?.url === pathname ||
        childrenLinks.some((link) => link.url === pathname),
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
        active: url === pathname,
      })),
    }),
  )

  return (
    <OrganizationWrapper
      showExternalLinks={true}
      showReadSpeaker={false}
      pageTitle={subpage?.title ?? ''}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      organizationPage={organizationPage}
      fullWidthContent={true}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      pageFeaturedImage={
        subpage?.featuredImage ?? organizationPage?.featuredImage
      }
      backLink={backLink}
      breadcrumbItems={
        customBreadcrumbItems
          ? customBreadcrumbItems
          : [
              {
                title: 'Ísland.is',
                href: linkResolver('homepage', [], locale).href,
              },
              {
                title: organizationPage?.title ?? '',
                href: linkResolver(
                  'organizationpage',
                  [organizationPage?.slug ?? ''],
                  locale,
                ).href,
              },
            ]
      }
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
    >
      {customContent ? (
        <GridContainer>
          <Box paddingTop={4}>
            <GridRow>
              <GridColumn
                span={['9/9', '9/9', '7/9']}
                offset={['0', '0', '1/9']}
              >
                {customContent}
              </GridColumn>
            </GridRow>
          </Box>
        </GridContainer>
      ) : (
        <SubPageContent
          subpage={subpage}
          namespace={namespace}
          organizationPage={organizationPage}
        />
      )}
    </OrganizationWrapper>
  )
}

const ParentSubpage = (props: SubPageProps) => {
  const { activeLocale } = useI18n()
  const router = useRouter()

  if (!props.parentSubpageProps) {
    return <Default {...props} />
  }

  return (
    <div>
      <TableOfContents
        headings={props.parentSubpageProps.tableOfContentHeadings}
        onClick={(headingId) => {
          const href = props.parentSubpageProps?.tableOfContentHeadings.find(
            (heading) => heading.headingId === headingId,
          )?.href
          if (href) {
            const sections = href.split('/')
            const subpageSlug = sections.pop()
            router.push(`${sections.join('/')}?subpageSlug=${subpageSlug}`)
          }
        }}
        tableOfContentsTitle={
          activeLocale === 'is' ? 'Efnisyfirlit' : 'Table of contents'
        }
        selectedHeadingId={props.parentSubpageProps.selectedHeadingId}
      />
      <SubPageContent
        namespace={props.namespace}
        organizationPage={props.organizationPage}
        subpage={props.subpage}
      />
    </div>
  )
}

const SubPage: Screen<SubPageProps> = (props) => {
  if (!props.parentSubpageProps) {
    return <Default {...props} />
  }

  return <ParentSubpage {...props} />
}

const renderSlices = (
  slices: Slice[],
  renderType: string,
  extraText: string,
  namespace: Record<string, string>,
  slug: string,
) => {
  switch (renderType) {
    case 'SliceDropdown':
      return <SliceDropdown slices={slices} sliceExtraText={extraText} />
    case 'SliceTableOfContents':
      return <SliceTableOfContents slices={slices} sliceExtraText={extraText} />
    default:
      return slices.map((slice, index) => {
        if (slice.__typename === 'AnchorPageListSlice') {
          return (
            <SliceMachine
              key={slice.id}
              slice={slice}
              namespace={namespace}
              slug={slug}
              marginBottom={index === slices.length - 1 ? 5 : 0}
              params={{
                renderAnchorPagesAsProfileCards: true,
                forceTitleSectionHorizontalPadding: 'true',
              }}
              fullWidth={true}
            />
          )
        }

        return (
          <SliceMachine
            key={slice.id}
            slice={slice}
            namespace={namespace}
            slug={slug}
            marginBottom={index === slices.length - 1 ? 5 : 0}
            params={{
              renderAnchorPagesAsProfileCards: true,
              forceTitleSectionHorizontalPadding: 'true',
            }}
          />
        )
      })
  }
}

SubPage.getProps = async ({ apolloClient, locale, query, req }) => {
  const pathname = safelyExtractPathnameFromUrl(req.url)

  const { slug, subSlug } = getSlugAndSubSlug(query, pathname)
  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganizationSubpage },
    },
    {
      data: { getOrganizationParentSubpage },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: slug as string,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationSubpageArgs>({
      query: GET_ORGANIZATION_SUBPAGE_QUERY,
      variables: {
        input: {
          organizationSlug: slug as string,
          slug: subSlug as string,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationParentSubpageArgs>({
      query: GET_ORGANIZATION_PARENT_SUBPAGE_QUERY,
      variables: {
        input: {
          organizationPageSlug: slug as string,
          slug: subSlug as string,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'OrganizationPages',
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

  if (!getOrganizationPage) {
    throw new CustomNextError(
      404,
      `Organization page with slug: ${slug} was not found`,
    )
  }

  if (getOrganizationParentSubpage) {
    let selectedIndex = 0

    // TODO: perhaps not use query params
    if (query.subpageSlug) {
      const index = getOrganizationParentSubpage.childLinks.findIndex(
        (link) => link.href.split('/').pop() === query.subpageSlug,
      )
      if (index > 0) {
        selectedIndex = index
      }
    }

    // TODO: what if this is not found
    const {
      data: { getOrganizationSubpage: subpage },
    } = await apolloClient.query<Query, QueryGetOrganizationSubpageArgs>({
      query: GET_ORGANIZATION_SUBPAGE_QUERY,
      variables: {
        input: {
          organizationSlug: slug as string,
          slug: getOrganizationParentSubpage.childLinks[selectedIndex].href
            .split('/')
            .pop() as string,
          lang: locale as ContentLanguage,
        },
      },
    })

    const tableOfContentHeadings = getOrganizationParentSubpage.childLinks.map(
      (link) => ({
        headingId: link.href,
        headingTitle: link.label,
        label: link.label,
        href: link.href,
      }),
    )
    const selectedHeadingId = tableOfContentHeadings[selectedIndex].headingId

    return {
      organizationPage: getOrganizationPage,
      subpage: subpage,
      parentSubpageProps: {
        tableOfContentHeadings,
        selectedHeadingId,
        parentSubpage: getOrganizationParentSubpage,
      },
      namespace,
      showSearchInHeader: false,
      locale: locale as Locale,
      ...getThemeConfig(
        getOrganizationPage?.theme,
        getOrganizationPage?.organization,
      ),
    }
  }

  if (!getOrganizationSubpage) {
    throw new CustomNextError(404, 'Organization subpage not found')
  }

  return {
    organizationPage: getOrganizationPage,
    subpage: getOrganizationSubpage,
    namespace,
    showSearchInHeader: false,
    locale: locale as Locale,
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

const getSlugAndSubSlug = (query: ParsedUrlQuery, pathname: string) => {
  const path = pathname?.split('/') ?? []
  let { slug, subSlug } = query

  if (!slug && path.length >= 2) {
    // The slug is the next-last index in the path, i.e. "syslumenn" in the case of "/s/syslumenn/utgefid-efni"
    slug = path[path.length - 2]
  }
  if (!subSlug && path.length > 0) {
    // The subslug is the last index in the path, i.e. "utgefid-efni" in the case of "/s/syslumenn/utgefid-efni"
    subSlug = path.pop()
  }

  return { slug, subSlug }
}

export default withMainLayout(SubPage)

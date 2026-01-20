import { NextRouter, useRouter } from 'next/router'
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
  ResponsiveSpace,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import {
  DigitalIcelandLatestNewsSlice,
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
  OrganizationPage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryGetOrganizationSubpageArgs,
  Slice,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { extractNamespaceFromOrganization } from '@island.is/web/utils/extractNamespaceFromOrganization'
import { webRichText } from '@island.is/web/utils/richText'
import { safelyExtractPathnameFromUrl } from '@island.is/web/utils/safelyExtractPathnameFromUrl'

import { Screen, ScreenContext } from '../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
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
}

export const SubPageContent = ({
  subpage,
  namespace,
  organizationPage,
  subpageTitleVariant = 'h1',
  paddingTop = 4,
}: Pick<SubPageProps, 'subpage' | 'organizationPage' | 'namespace'> & {
  subpageTitleVariant?: 'h1' | 'h2'
  paddingTop?: ResponsiveSpace
}) => {
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
        <Box paddingTop={paddingTop}>
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
                        <Text
                          variant={subpageTitleVariant}
                          as={subpageTitleVariant}
                        >
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

const generateNavigationItems = (
  organizationPage: OrganizationPage | null | undefined,
  pathname: string,
): NavigationItem[] => {
  const links = (organizationPage?.menuLinks ?? []).map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink?.text ?? '',
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
  return links
}

export const getSubpageNavList = (
  organizationPage: OrganizationPage | null | undefined,
  router: NextRouter,
  depthOfMatch: number | null = null,
): NavigationItem[] => {
  const pathname = new URL(router.asPath, 'https://island.is').pathname
  if (!depthOfMatch) {
    return generateNavigationItems(organizationPage, pathname)
  }

  let items = generateNavigationItems(organizationPage, pathname)
  const someItemIsActive = items.some(
    (item) =>
      Boolean(item.active) ||
      Boolean(item.items?.some((subItem) => Boolean(subItem.active))),
  )

  if (someItemIsActive) {
    return items
  }

  // Only match a potential smaller depth if no match is found otherwise
  items = generateNavigationItems(
    organizationPage,
    pathname
      .split('/')
      .slice(0, depthOfMatch + 1) // Add one to account for the starting '/'
      .join('/'),
  )

  return items
}

export const SubPageBottomSlices = ({
  organizationPage,
  subpage,
  namespace,
}: Pick<SubPageProps, 'organizationPage' | 'subpage' | 'namespace'>) => {
  return (
    !!organizationPage && (
      <Stack
        space={
          subpage?.bottomSlices && subpage.bottomSlices.length > 0
            ? SLICE_SPACING
            : 0
        }
      >
        {subpage?.bottomSlices?.map((slice) => {
          if (slice.__typename === 'LatestNewsSlice') {
            return (
              <Box paddingTop={[5, 5, 8]} paddingBottom={[2, 2, 5]}>
                <DigitalIcelandLatestNewsSlice
                  slice={slice}
                  slug={organizationPage.slug}
                />
              </Box>
            )
          }
          return (
            <SliceMachine
              key={slice.id}
              slice={slice}
              namespace={namespace}
              slug={organizationPage.slug}
              fullWidth={true}
            />
          )
        })}
      </Stack>
    )
  )
}

type SubPageScreenContext = ScreenContext & {
  organizationPage?: Query['getOrganizationPage']
}

const SubPage: Screen<SubPageProps, SubPageScreenContext> = ({
  organizationPage,
  subpage,
  namespace,
  locale,
  customContent,
  customBreadcrumbItems,
  customContentfulIds,
  backLink,
}) => {
  const router = useRouter()
  const { activeLocale } = useI18n()

  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  const contentfulIds = customContentfulIds
    ? customContentfulIds
    : [organizationPage?.id, subpage?.id]

  useContentfulId(...contentfulIds)

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
        items: getSubpageNavList(
          organizationPage,
          router,
          activeLocale === 'is' ? 3 : 4,
        ),
      }}
      mainContent={
        customContent ? (
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
        )
      }
    >
      <SubPageBottomSlices
        namespace={namespace}
        organizationPage={organizationPage}
        subpage={subpage}
      />
    </OrganizationWrapper>
  )
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
        if (
          slice.__typename === 'AnchorPageListSlice' ||
          slice.__typename === 'OrganizationParentSubpageList'
        ) {
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

SubPage.getProps = async ({
  apolloClient,
  locale,
  query,
  req,
  organizationPage,
}) => {
  const pathname = safelyExtractPathnameFromUrl(req.url)

  const { slug, subSlug } = getSlugAndSubSlug(query, pathname)
  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganizationSubpage },
    },
    namespace,
  ] = await Promise.all([
    !organizationPage
      ? apolloClient.query<Query, QueryGetOrganizationPageArgs>({
          query: GET_ORGANIZATION_PAGE_QUERY,
          variables: {
            input: {
              slug: slug as string,
              lang: locale as ContentLanguage,
              subpageSlugs: subSlug ? [subSlug] : [],
            },
          },
        })
      : {
          data: { getOrganizationPage: organizationPage },
        },
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

  if (!getOrganizationSubpage) {
    throw new CustomNextError(404, 'Organization subpage not found')
  }

  if (!getOrganizationPage) {
    throw new CustomNextError(
      404,
      `Organization page with slug: ${slug} was not found`,
    )
  }

  const organizationNamespace = extractNamespaceFromOrganization(
    getOrganizationPage.organization,
  )

  return {
    organizationPage: getOrganizationPage,
    subpage: getOrganizationSubpage,
    namespace,
    showSearchInHeader: false,
    locale: locale as Locale,
    customTopLoginButtonItem: organizationNamespace?.customTopLoginButtonItem,
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

const getSlugAndSubSlug = (query: ParsedUrlQuery, pathname: string) => {
  const path = pathname?.split('/') ?? []
  let [slug, subSlug] = (query.slugs as string[]) ?? []

  if (!slug && path.length >= 2) {
    // The slug is the next-last index in the path, i.e. "syslumenn" in the case of "/s/syslumenn/utgefid-efni"
    slug = path[path.length - 2]
  }
  if (!subSlug && path.length > 0) {
    // The subslug is the last index in the path, i.e. "utgefid-efni" in the case of "/s/syslumenn/utgefid-efni"
    subSlug = path.pop() as string
  }

  return { slug, subSlug }
}

export default withMainLayout(SubPage)

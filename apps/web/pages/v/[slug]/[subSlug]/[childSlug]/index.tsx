import { useMemo } from 'react'
import { useRouter } from 'next/router'

import type { BreadCrumbItem } from '@island.is/island-ui/core'
import type { ProjectPage } from '@island.is/web/graphql/schema'
import withApollo from '@island.is/web/graphql/withApollo'
import { useLinkResolver } from '@island.is/web/hooks'
import { useI18n, withLocale } from '@island.is/web/i18n'
import type { LayoutProps } from '@island.is/web/layouts/main'
import type { GenericListItemPageProps } from '@island.is/web/screens/GenericList/GenericListItem'
import GenericListItemPage from '@island.is/web/screens/GenericList/GenericListItem'
import SubPageLayout, {
  type PageProps,
} from '@island.is/web/screens/Project/Project'
import type { Screen as ScreenType, ScreenContext } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

interface ComponentProps {
  parentProps: {
    layoutProps: LayoutProps
    componentProps: PageProps
  }
  // Not set when the page is a parent subpage chapter
  genericListItemProps?: GenericListItemPageProps
}

export const Component: ScreenType<ComponentProps> = ({
  parentProps,
  genericListItemProps,
}) => {
  const { activeLocale } = useI18n()
  const router = useRouter()
  const { linkResolver } = useLinkResolver()
  const backLinkUrl = useMemo(() => {
    const pathname = new URL(router.asPath, 'https://island.is').pathname
    return pathname.slice(0, pathname.lastIndexOf('/'))
  }, [router.asPath])

  if (!genericListItemProps) {
    // The page is a chapter belonging to a parent subpage
    return (
      <SubPageLayout
        layoutProps={parentProps.layoutProps}
        componentProps={parentProps.componentProps}
      />
    )
  }

  const { parentSubpage, chapterSlug } = parentProps.componentProps
  const projectPage = parentProps.componentProps.projectPage as ProjectPage
  // When the generic list is on a parent subpage chapter, the chapter is the subpage
  const subpageSlug = parentSubpage ? chapterSlug : router.query.subSlug
  const subpage = projectPage.projectSubpages.find(
    (subpage) => subpage.slug === subpageSlug,
  )

  const breadcrumbItems: BreadCrumbItem[] = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage').href,
    },
    {
      title: projectPage?.title ?? '',
      href: linkResolver('projectpage', [projectPage?.slug ?? '']).href,
    },
  ]

  if (parentSubpage) {
    breadcrumbItems.push({
      title: parentSubpage.title,
      href: linkResolver('projectsubpage', [
        projectPage?.slug ?? '',
        parentSubpage.slug,
      ]).href,
    })
  }

  breadcrumbItems.push({
    title: subpage?.title ?? '',
    href: backLinkUrl,
    isTag: true,
  })

  return (
    <SubPageLayout
      layoutProps={parentProps.layoutProps}
      componentProps={{
        ...parentProps.componentProps,
        customContentfulIds: [
          projectPage?.id,
          parentSubpage?.id,
          subpage?.id,
          genericListItemProps.item.id,
        ],
        customBreadcrumbItems: breadcrumbItems,
        customContent: (
          <GenericListItemPage
            item={genericListItemProps.item}
            ogTitle={
              genericListItemProps.item.title &&
              `${genericListItemProps.item.title}${
                subpage?.title ? ` | ${subpage.title}` : ''
              }`
            }
          />
        ),
        projectPage: {
          ...projectPage,
          backLink: {
            date: '',
            id: '',
            text: activeLocale === 'is' ? 'Til baka' : 'Go back',
            url: backLinkUrl,
          },
        },
      }}
    />
  )
}

const withQuery = (
  ctx: ScreenContext,
  query: Record<string, string | string[] | undefined>,
) => ({
  ...ctx,
  query: {
    ...ctx.query,
    ...query,
  },
})

const ignoreNotFound = (error: unknown) => {
  if (error instanceof CustomNextError) {
    return null
  }
  throw error
}

Component.getProps = async (ctx) => {
  // /v/[slug]/[subSlug]/[childSlug]/[genericListItemSlug]
  // A generic list item on a chapter that belongs to a parent subpage
  if (ctx.query.genericListItemSlug) {
    const [parentProps, genericListItemProps] = await Promise.all([
      SubPageLayout.getProps(ctx),
      GenericListItemPage.getProps(ctx),
    ])

    if (!parentProps?.componentProps.parentSubpage) {
      throw new CustomNextError(404, 'Project parent subpage was not found')
    }

    return { parentProps, genericListItemProps }
  }

  // /v/[slug]/[subSlug]/[childSlug]
  // The last slug is either a chapter of a parent subpage or a generic list item
  const [parentProps, genericListItemProps] = await Promise.all([
    SubPageLayout.getProps(ctx).catch(ignoreNotFound),
    GenericListItemPage.getProps(
      withQuery(ctx, { genericListItemSlug: ctx.query.childSlug }),
    ).catch(ignoreNotFound),
  ])

  if (parentProps?.componentProps.parentSubpage) {
    // A parent subpage chapter
    return { parentProps }
  }

  if (!genericListItemProps) {
    throw new CustomNextError(404, 'Could not fetch generic list item props')
  }

  if (parentProps) {
    // A generic list item on a project subpage
    return { parentProps, genericListItemProps }
  }

  // A generic list item on a parent subpage, the parent subpage displays its
  // first chapter when no chapter slug is present in the url
  const firstChapterProps = await SubPageLayout.getProps(
    withQuery(ctx, { childSlug: undefined }),
  )

  if (!firstChapterProps?.componentProps.parentSubpage) {
    throw new CustomNextError(404, 'Project parent subpage was not found')
  }

  return { parentProps: firstChapterProps, genericListItemProps }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const Screen = withApollo(withLocale('is')(Component))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)

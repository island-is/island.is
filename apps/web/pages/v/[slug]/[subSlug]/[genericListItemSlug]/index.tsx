import { useMemo } from 'react'
import { useRouter } from 'next/router'

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
import type { Screen as ScreenType } from '@island.is/web/types'
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

  const projectPage = parentProps.componentProps.projectPage as ProjectPage
  const subpage = projectPage.projectSubpages.find(
    (subpage) => subpage.slug === router.query.subSlug,
  )

  return (
    <SubPageLayout
      layoutProps={parentProps.layoutProps}
      componentProps={{
        ...parentProps.componentProps,
        customContentfulIds: [
          projectPage?.id,
          subpage?.id,
          genericListItemProps.item.id,
        ],
        customBreadcrumbItems: [
          {
            title: 'Ísland.is',
            href: linkResolver('homepage').href,
          },
          {
            title: projectPage?.title ?? '',
            href: linkResolver('projectpage', [projectPage?.slug ?? '']).href,
          },
          {
            title: subpage?.title ?? '',
            href: backLinkUrl,
            isTag: true,
          },
        ],
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

Component.getProps = async (ctx) => {
  const [parentProps, genericListItemProps] = await Promise.all([
    SubPageLayout.getProps(ctx),
    GenericListItemPage.getProps(ctx).catch((error) => {
      // Chapters of a parent subpage aren't generic list items
      if (error instanceof CustomNextError) {
        return null
      }
      throw error
    }),
  ])

  if (!parentProps) {
    throw new CustomNextError(
      404,
      'Could not fetch subpage layout for generic list item',
    )
  }

  // The last slug is a chapter when the subpage slug belongs to a parent subpage
  if (parentProps.componentProps.parentSubpage) {
    return { parentProps }
  }

  if (!genericListItemProps) {
    throw new CustomNextError(404, 'Could not fetch generic list item props')
  }

  return {
    parentProps,
    genericListItemProps,
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const Screen = withApollo(withLocale('is')(Component))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)

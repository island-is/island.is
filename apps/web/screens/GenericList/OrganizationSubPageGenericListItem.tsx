import { useMemo } from 'react'
import { useRouter } from 'next/router'

import { Query } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { type LayoutProps } from '@island.is/web/layouts/main'
import { Screen, ScreenContext } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import OrganizationParentSubpage from '../Organization/ParentSubpage'
import SubPage, { type SubPageProps } from '../Organization/SubPage'
import GenericListItemPage, {
  type GenericListItemPageProps,
} from './GenericListItem'

export interface OrganizationSubPageGenericListItemProps {
  parentProps: {
    layoutProps: LayoutProps
    componentProps: SubPageProps
  }
  genericListItemProps: GenericListItemPageProps
}

type OrganizationSubPageGenericListItemScreenContext = ScreenContext & {
  organizationPage?: Query['getOrganizationPage']
}

const OrganizationSubPageGenericListItem: Screen<
  OrganizationSubPageGenericListItemProps,
  OrganizationSubPageGenericListItemScreenContext
> = (props) => {
  const { organizationPage, subpage } = props.parentProps.componentProps
  const router = useRouter()
  const { linkResolver } = useLinkResolver()
  const backLinkUrl = useMemo(() => {
    const pathname = new URL(router.asPath, 'https://island.is').pathname
    return pathname.slice(0, pathname.lastIndexOf('/'))
  }, [router.asPath])
  const { activeLocale } = useI18n()
  return (
    <SubPage
      layoutProps={props.parentProps.layoutProps}
      componentProps={{
        ...props.parentProps.componentProps,
        customContent: (
          <GenericListItemPage
            item={props.genericListItemProps.item}
            ogTitle={
              props.genericListItemProps.item.title &&
              `${props.genericListItemProps.item.title}${
                props.parentProps.componentProps.subpage?.title
                  ? ` | ${props.parentProps.componentProps.subpage.title}`
                  : ''
              }`
            }
          />
        ),
        customBreadcrumbItems: [
          {
            title: 'Ísland.is',
            href: linkResolver('homepage').href,
          },
          {
            title: organizationPage?.title ?? '',
            href: linkResolver('organizationpage', [
              organizationPage?.slug ?? '',
            ]).href,
          },
          {
            title: subpage?.title ?? '',
            href: backLinkUrl,
            isTag: true,
          },
        ],
        backLink: {
          text: activeLocale === 'is' ? 'Til baka' : 'Go back',
          url: backLinkUrl,
        },
        customContentfulIds: [
          organizationPage?.id,
          subpage?.id,
          props.genericListItemProps.item.id,
        ],
      }}
    />
  )
}

// The page that the generic list is displayed on is either an organization
// subpage or a subpage that belongs to an organization parent subpage. Subpages
// that belong to a parent subpage can't be fetched by slug on their own, so in
// that case the parent subpage screen needs to resolve them.
const getParentProps = (
  context: OrganizationSubPageGenericListItemScreenContext,
  querySlugs: string[],
) => {
  const withSlugs = (slugs: string[]) => ({
    ...context,
    query: {
      ...context.query,
      slugs,
    },
  })

  // /s/[organization]/[parentSubpage]/[subpage]/[item]
  if (querySlugs.length === 4) {
    return OrganizationParentSubpage.getProps(withSlugs(querySlugs.slice(0, 3)))
  }

  // /s/[organization]/[subpage]/[item]
  return SubPage.getProps(withSlugs(querySlugs.slice(0, 2))).catch((error) => {
    if (!(error instanceof CustomNextError)) {
      throw error
    }
    // /s/[organization]/[parentSubpage]/[item] - a parent subpage displays the
    // content of its first child when no subpage slug is present in the url
    return OrganizationParentSubpage.getProps(
      withSlugs(querySlugs.slice(0, 2)),
    ).catch((parentSubpageError) => {
      if (!(parentSubpageError instanceof CustomNextError)) {
        throw parentSubpageError
      }
      // Neither lookup found a page, the original error describes the url best
      throw error
    })
  })
}

OrganizationSubPageGenericListItem.getProps = async (context) => {
  const querySlugs = (context.query.slugs ?? []) as string[]

  const [parentProps, genericListItemProps] = await Promise.all([
    getParentProps(context, querySlugs),
    GenericListItemPage.getProps(context),
  ])

  return {
    parentProps,
    genericListItemProps,
  } as OrganizationSubPageGenericListItemProps
}

export default OrganizationSubPageGenericListItem

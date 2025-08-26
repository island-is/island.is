import { useMemo } from 'react'
import { useRouter } from 'next/router'

import { Query } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { type LayoutProps } from '@island.is/web/layouts/main'
import { Screen, ScreenContext } from '@island.is/web/types'

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

OrganizationSubPageGenericListItem.getProps = async (context) => {
  const organizationPageSlug = context.query.slugs?.[0] ?? ''
  const organizationSubpageSlug =
    context.query.slugs?.length === 4
      ? context.query.slugs[2]
      : context.query.slugs?.[1] ?? ''

  const [subPageProps, genericListItemProps] = await Promise.all([
    SubPage.getProps({
      ...context,
      query: {
        ...context.query,
        slugs: [organizationPageSlug, organizationSubpageSlug],
      },
    }),
    GenericListItemPage.getProps(context),
  ])
  return {
    parentProps: subPageProps,
    genericListItemProps,
  } as OrganizationSubPageGenericListItemProps
}

export default OrganizationSubPageGenericListItem

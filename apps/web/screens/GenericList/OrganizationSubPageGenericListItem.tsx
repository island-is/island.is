import { useMemo } from 'react'
import { useRouter } from 'next/router'

import { useLinkResolver } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { type LayoutProps, withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'

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

const OrganizationSubPageGenericListItem: Screen<
  OrganizationSubPageGenericListItemProps
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
  const [subPageProps, genericListItemProps] = await Promise.all([
    SubPage.getProps(context),
    GenericListItemPage.getProps(context),
  ])
  return {
    parentProps: subPageProps,
    genericListItemProps,
  } as OrganizationSubPageGenericListItemProps
}

export default OrganizationSubPageGenericListItem

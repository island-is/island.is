import { useMemo } from 'react'
import { useRouter } from 'next/router'

import withApollo from '@island.is/web/graphql/withApollo'
import { useLinkResolver } from '@island.is/web/hooks'
import { useI18n, withLocale } from '@island.is/web/i18n'
import type { LayoutProps } from '@island.is/web/layouts/main'
import GenericListItemPage, {
  type GenericListItemPageProps,
} from '@island.is/web/screens/GenericList/GenericListItem'
import SubPageLayout, {
  type SubPageProps,
} from '@island.is/web/screens/Organization/SubPage'
import type { Screen as ScreenType } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

interface ComponentProps {
  parentProps: {
    layoutProps: LayoutProps
    componentProps: SubPageProps
  }
  genericListItemProps: GenericListItemPageProps
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

  const { organizationPage, subpage } = parentProps.componentProps

  return (
    <SubPageLayout
      layoutProps={parentProps.layoutProps}
      componentProps={{
        ...parentProps.componentProps,
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
          genericListItemProps.item.id,
        ],
      }}
    />
  )
}

Component.getProps = async (ctx) => {
  const [parentProps, genericListItemProps] = await Promise.all([
    SubPageLayout.getProps?.(ctx),
    GenericListItemPage.getProps?.(ctx),
  ])

  if (!parentProps) {
    throw new CustomNextError(
      404,
      'Could not fetch subpage layout for generic list item',
    )
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

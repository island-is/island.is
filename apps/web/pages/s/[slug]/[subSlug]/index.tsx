import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import { LayoutProps } from '@island.is/web/layouts/main'
import StandaloneSitemapLevel1, {
  type StandaloneSitemapLevel1Props,
} from '@island.is/web/screens/Organization/Standalone/sitemap/Level1'
import StandaloneSubpage, {
  type StandaloneSubpageProps,
} from '@island.is/web/screens/Organization/Standalone/Subpage'
import SubPage, {
  type SubPageProps,
} from '@island.is/web/screens/Organization/SubPage'
import type { Screen as ScreenType } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

type ComponentProps =
  | {
      type: 'standalone-sitemap'
      props: StandaloneSitemapLevel1Props
    }
  | {
      type: 'standalone-subpage'
      props: StandaloneSubpageProps
    }
  | {
      type: 'default-subpage'
      props: {
        layoutProps: LayoutProps
        componentProps: SubPageProps
      }
    }

export const Component: ScreenType<ComponentProps> = ({ props, type }) => {
  if (type === 'standalone-sitemap')
    return <StandaloneSitemapLevel1 {...props} />
  if (type === 'standalone-subpage') return <StandaloneSubpage {...props} />
  return <SubPage {...props} />
}

Component.getProps = async (ctx) => {
  try {
    const sitemapProps = await StandaloneSitemapLevel1.getProps?.(ctx)
    return {
      props: sitemapProps as StandaloneSitemapLevel1Props,
      type: 'standalone-sitemap',
    }
  } catch {
    try {
      const standaloneSubpageProps = await StandaloneSubpage.getProps?.(ctx)

      if (standaloneSubpageProps) {
        return {
          props: standaloneSubpageProps,
          type: 'standalone-subpage',
        }
      }
    } catch {
      //
    }

    const defaultProps = await SubPage.getProps?.(ctx)

    if (!defaultProps) {
      throw new CustomNextError(404, 'Organization subpage was not found')
    }

    return {
      props: defaultProps,
      type: 'default-subpage',
    }
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const Screen = withApollo(withLocale('is')(Component))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)

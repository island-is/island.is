import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import { LayoutProps } from '@island.is/web/layouts/main'
import DefaultHome from '@island.is/web/screens/Organization/Home'
import { type HomeProps } from '@island.is/web/screens/Organization/Home/Home'
import StandaloneHome, {
  type StandaloneHomeProps,
} from '@island.is/web/screens/Organization/Standalone/Home'
import type { Screen as ScreenType } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

interface ComponentProps {
  standaloneProps: StandaloneHomeProps
  defaultProps: {
    layoutProps: LayoutProps
    componentProps: HomeProps
  }
}

const Component: ScreenType<ComponentProps> = ({
  standaloneProps,
  defaultProps,
}) => {
  if (standaloneProps.organizationPage.theme === 'standalone') {
    return <StandaloneHome {...standaloneProps} />
  }

  return (
    <DefaultHome
      componentProps={defaultProps.componentProps}
      layoutProps={defaultProps.layoutProps}
    />
  )
}

Component.getProps = async (ctx) => {
  const [standaloneProps, defaultProps] = await Promise.all([
    StandaloneHome.getProps?.(ctx),
    DefaultHome.getProps?.(ctx),
  ])

  if (!standaloneProps?.organizationPage) {
    throw new CustomNextError(404, 'Organization page was not found')
  }
  if (!defaultProps?.componentProps?.organizationPage) {
    throw new CustomNextError(404, 'Organization page was not found')
  }

  return {
    standaloneProps: standaloneProps as StandaloneHomeProps,
    defaultProps: defaultProps,
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const Screen = withApollo(withLocale('is')(Component))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)

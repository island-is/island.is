import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import RegulationsHome from '@island.is/web/screens/Regulations/RegulationsHome'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const Screen = withApollo(withLocale('is')(RegulationsHome))

const ScreenWithGetInitialProps: typeof Screen & {
  getInitialProps?: typeof Screen.getProps
} = Screen

ScreenWithGetInitialProps.getInitialProps = Screen.getProps

export default ScreenWithGetInitialProps

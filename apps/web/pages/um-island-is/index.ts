import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import aboutScreen from '@island.is/web/screens/AboutPage/AboutPage'

export default withApollo(
  withLocale('is')(withMainLayout(aboutScreen, { showHeader: false })),
)

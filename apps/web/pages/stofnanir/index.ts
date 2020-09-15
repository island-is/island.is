import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import organizationsScreen from '@island.is/web/screens/Organizations/Organiziations'

export default withApollo(withLocale('is')(withMainLayout(organizationsScreen)))

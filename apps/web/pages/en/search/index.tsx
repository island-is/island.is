import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import searchScreen from '@island.is/web/screens/Search/Search'

export default withApollo(withLocale('en')(withMainLayout(searchScreen)))

import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import searchScreen from '@island.is/web/screens/Search/Search'

export default withApollo(withLocale('is')(searchScreen))

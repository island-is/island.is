import withLocale from '@island.is/web/i18n/withLocale'
import withApollo from '@island.is/web/graphql/withApollo'
import searchScreen from '../../screens/Search/Search'

export default withApollo(withLocale('is')(searchScreen))

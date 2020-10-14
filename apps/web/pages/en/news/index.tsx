import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import newsListScreen from '@island.is/web/screens/NewsList'

export default withApollo(withLocale('en')(newsListScreen))

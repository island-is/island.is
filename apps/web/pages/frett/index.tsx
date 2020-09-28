import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import NewsListScreen from '@island.is/web/screens/NewsList'

export default withApollo(withLocale('is')(NewsListScreen))

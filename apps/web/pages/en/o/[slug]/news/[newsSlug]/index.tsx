import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import NewsItemScreen from '@island.is/web/screens/Organization/NewsItem'

export default withApollo(withLocale('en')(NewsItemScreen))

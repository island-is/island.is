import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import NewsList from '@island.is/web/screens/Organization/NewsList'

export default withApollo(withLocale('en')(NewsList))

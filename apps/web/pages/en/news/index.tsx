import { withErrorBoundary } from '@island.is/web/units/ErrorBoundary'
import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import newsListScreen from '../../../screens/NewsItem'

export default withErrorBoundary(withApollo(withLocale('en')(newsListScreen)))

import { withLocale } from '@island.is/web/i18n'
import newsListScreen from '../../../screens/NewsItem'
import { withApollo } from '@island.is/web/graphql'
import { withErrorBoundary } from '@island.is/web/units/ErrorBoundary'

export default withApollo(withLocale('en')(withErrorBoundary(newsListScreen)))

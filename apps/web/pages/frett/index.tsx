import { withLocale } from '@island.is/web/i18n'
import NewsListScreen from '../../screens/NewsList'
import { withApollo } from '@island.is/web/graphql'
import { withErrorBoundary } from '@island.is/web/units/ErrorBoundary'

export default withApollo(withLocale('is')(withErrorBoundary(NewsListScreen)))

import { withLocale } from '@island.is/web/i18n'
import NewsListScreen from '../../screens/NewsList'
import { withErrorBoundary } from '@island.is/web/units/ErrorBoundary'

export default withLocale('is')(withErrorBoundary(NewsListScreen))

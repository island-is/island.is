import { withLocale } from '@island.is/web/i18n'
import newsListScreen from '../../../screens/NewsItem'
import { withErrorBoundary } from '@island.is/web/units/ErrorBoundary'

export default withLocale('en')(withErrorBoundary(newsListScreen))

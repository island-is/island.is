import { withLocale } from '@island.is/web/i18n'
import newsItemScreen from '../../../../screens/NewsItem'
import { withErrorBoundary } from '@island.is/web/units/ErrorBoundary'

export default withLocale('en')(withErrorBoundary(newsItemScreen))

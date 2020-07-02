import { withLocale } from '../../i18n'
import searchScreen from '../../screens/Search/Search'
import { withErrorBoundary } from '../../units/ErrorBoundary'

export default withLocale('is')(withErrorBoundary(searchScreen))

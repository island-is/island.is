import { withLocale } from '@island.is/web/i18n'
import searchScreen from '../../screens/Search/Search'
import { withErrorBoundary } from '@island.is/web/units/ErrorBoundary'

export default withLocale('is')(withErrorBoundary(searchScreen))

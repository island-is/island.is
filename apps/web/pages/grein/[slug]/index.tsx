import { withLocale } from '@island.is/web/i18n'
import articleScreen from '../../../screens/Article'
import { withErrorBoundary } from '@island.is/web/units/ErrorBoundary'

export default withLocale('is')(withErrorBoundary(articleScreen))

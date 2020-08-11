import { withLocale } from '../../../../i18n'
import articleScreen from '../../../../screens/Article'
import { withErrorBoundary } from '../../../../units/ErrorBoundary'

export default withLocale('en')(withErrorBoundary(articleScreen))

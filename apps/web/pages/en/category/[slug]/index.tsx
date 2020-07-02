import { withLocale } from '../../../../i18n'
import categoryScreen from '../../../../screens/Category/Category'
import { withErrorBoundary } from '../../../../units/ErrorBoundary'

export default withLocale('en')(withErrorBoundary(categoryScreen))

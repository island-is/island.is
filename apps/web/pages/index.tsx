import { withLocale } from '../i18n'
import homeScreen from '../screens/Home'
import { withErrorBoundary } from '../units/ErrorBoundary'

export default withLocale('is')(withErrorBoundary(homeScreen))

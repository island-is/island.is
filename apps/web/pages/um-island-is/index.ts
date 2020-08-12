import { withLocale } from '../../i18n'
import aboutScreen from '../../screens/AboutPage/AboutPage'
import { withErrorBoundary } from '../../units/ErrorBoundary'

export default withLocale('is')(withErrorBoundary(aboutScreen))

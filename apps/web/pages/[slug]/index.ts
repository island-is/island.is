import { withLocale } from '../../i18n'
import genericScreen from '../../screens/GenericPage/GenericPage'
import { withErrorBoundary } from '../../units/ErrorBoundary'

export default withLocale('is')(withErrorBoundary(genericScreen))

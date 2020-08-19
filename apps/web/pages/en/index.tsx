import { withLocale } from '@island.is/web/i18n'
import homeScreen from '../../screens/Home'
import { withErrorBoundary } from '@island.is/web/units/ErrorBoundary'

export default withLocale('en')(withErrorBoundary(homeScreen))

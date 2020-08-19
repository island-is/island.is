import { withLocale } from '@island.is/web/i18n'
import landingScreen from '../../screens/LandingPage/LandingPage'
import { withErrorBoundary } from '@island.is/web/units/ErrorBoundary'

export default withLocale('is')(withErrorBoundary(landingScreen))

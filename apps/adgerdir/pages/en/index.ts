import { withLocale } from '@island.is/adgerdir/i18n'
import homeScreen from '@island.is/adgerdir/screens/Home'
import { withErrorBoundary } from '@island.is/adgerdir/units'

export default withLocale('en')(withErrorBoundary(homeScreen))

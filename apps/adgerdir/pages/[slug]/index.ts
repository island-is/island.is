import { withLocale } from '@island.is/adgerdir/i18n'
import articlePage from '@island.is/adgerdir/screens/Article'
import { withErrorBoundary } from '@island.is/adgerdir/units'

export default withLocale('is')(withErrorBoundary(articlePage))

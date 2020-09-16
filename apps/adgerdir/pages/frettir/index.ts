import { withLocale } from '@island.is/adgerdir/i18n'
import newsListPage from '@island.is/adgerdir/screens/NewsList'
import { withErrorBoundary } from '@island.is/adgerdir/units'

export default withLocale('is')(withErrorBoundary(newsListPage))

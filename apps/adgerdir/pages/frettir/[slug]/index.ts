import { withLocale } from '@island.is/adgerdir/i18n'
import newsArticlePage from '@island.is/adgerdir/screens/NewsArticle'
import { withErrorBoundary } from '@island.is/adgerdir/units'

export default withLocale('is')(withErrorBoundary(newsArticlePage))

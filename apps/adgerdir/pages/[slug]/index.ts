import { withLocale } from '../../i18n'
import articlePage from '../../screens/Article'
import { withErrorBoundary } from '../../units/ErrorBoundary'

export default withLocale('is')(withErrorBoundary(articlePage))

import { withLocale } from '@island.is/web/i18n'
import articleScreen from '../../../screens/Article'
import { withApollo } from '@island.is/web/graphql'
import { withErrorBoundary } from '@island.is/web/units/ErrorBoundary'

export default withApollo(withLocale('is')(withErrorBoundary(articleScreen)))

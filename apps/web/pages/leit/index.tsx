import { withLocale } from '@island.is/web/i18n'
import searchScreen from '../../screens/Search/Search'
import { withApollo } from '@island.is/web/graphql'
import { withErrorBoundary } from '@island.is/web/units/ErrorBoundary'

export default withApollo(withLocale('is')(withErrorBoundary(searchScreen)))

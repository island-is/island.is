import { withErrorBoundary } from '@island.is/web/units/ErrorBoundary'
import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import searchScreen from '../../../screens/Search/Search'

export default withErrorBoundary(withApollo(withLocale('is')(searchScreen)))

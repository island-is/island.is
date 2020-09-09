import { withErrorBoundary } from '@island.is/web/units/ErrorBoundary'
import withLocale from '@island.is/web/i18n/withLocale'
import withApollo from '@island.is/web/graphql/withApollo'
import homeScreen from '@island.is/web/screens/Home'

export default withErrorBoundary(withApollo(withLocale('is')(homeScreen)))

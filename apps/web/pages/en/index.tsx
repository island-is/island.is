import { withErrorBoundary } from '@island.is/web/units/ErrorBoundary'
import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import homeScreen from '../../screens/Home'

export default withErrorBoundary(withApollo(withLocale('en')(homeScreen)))

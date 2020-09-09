import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import aboutScreen from '../../screens/AboutPage/AboutPage'
import { withErrorBoundary } from '@island.is/web/units/ErrorBoundary'

export default withErrorBoundary(withApollo(withLocale('is')(aboutScreen)))

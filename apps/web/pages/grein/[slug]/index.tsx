import { withErrorBoundary } from '@island.is/web/units/ErrorBoundary'
import { withApollo } from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n/withLocale'
import articleScreen from '@island.is/web/screens/Article'

export default withErrorBoundary(withApollo(withLocale('is')(articleScreen)))

import { withLocale } from '@island.is/web/i18n'
import homeScreen from '../../screens/Home'
import { withApollo } from '@island.is/web/graphql'
import { withErrorBoundary } from '@island.is/web/units/ErrorBoundary'

export default withApollo(withLocale('en')(withErrorBoundary(homeScreen)))

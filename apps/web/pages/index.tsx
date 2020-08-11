import { withLocale } from '../i18n'
import homeScreen from '../screens/Home'
import { withApollo } from '../graphql'
import { withErrorBoundary } from '../units/ErrorBoundary'

export default withApollo(withLocale('is')(withErrorBoundary(homeScreen)))

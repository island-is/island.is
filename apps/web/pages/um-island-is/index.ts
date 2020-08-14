import { withLocale } from '@island.is/web/i18n'
import aboutScreen from '../../screens/AboutPage/AboutPage'
import { withApollo } from '@island.is/web/graphql'
import { withErrorBoundary } from '@island.is/web/units/ErrorBoundary'

export default withApollo(withLocale('is')(withErrorBoundary(aboutScreen)))

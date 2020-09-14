import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import landingScreen from '../../screens/LandingPage/LandingPage'

export default withApollo(withLocale('is')(landingScreen))

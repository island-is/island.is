import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import aboutScreen from '../../screens/AboutPage/AboutPage'

export default withApollo(withLocale('is')(aboutScreen))

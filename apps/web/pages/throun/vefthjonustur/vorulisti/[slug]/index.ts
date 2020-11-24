import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import serviceDetailsScreen from '@island.is/web/screens/ServiceDetails/ServiceDetails'

export default withApollo(withLocale('is')(serviceDetailsScreen))
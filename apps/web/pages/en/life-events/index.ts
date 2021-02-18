import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import genericOverviewScreen from '@island.is/web/screens/GenericOverview/GenericOverview'

export default withApollo(withLocale('en')(genericOverviewScreen))

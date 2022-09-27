import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import ApiDetails from '@island.is/web/screens/Organization/StafraentIsland/ApiDetails'

export default withApollo(withLocale('en')(ApiDetails))

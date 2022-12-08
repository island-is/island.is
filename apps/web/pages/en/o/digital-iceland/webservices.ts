import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import ApiCatalogue from '@island.is/web/screens/Organization/StafraentIsland/ApiCatalogue'

export default withApollo(withLocale('en')(ApiCatalogue))

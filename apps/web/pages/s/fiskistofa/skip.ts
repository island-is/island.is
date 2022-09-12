import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import ShipDetails from '@island.is/web/screens/Organization/Fiskistofa/ShipDetails'

export default withApollo(withLocale('is')(ShipDetails))

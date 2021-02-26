import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import Auctions from '@island.is/web/screens/Syslumenn/Auctions'

export default withApollo(withLocale('is')(Auctions))

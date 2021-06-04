import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import Auction from '@island.is/web/screens/Organization/Syslumenn/Auction'

export default withApollo(withLocale('is')(Auction))

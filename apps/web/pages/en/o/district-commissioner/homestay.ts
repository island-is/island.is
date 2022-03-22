import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import Homestay from '@island.is/web/screens/Organization/Syslumenn/Homestay'

export default withApollo(withLocale('en')(Homestay))

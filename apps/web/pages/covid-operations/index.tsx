import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import adgerdirHomeScreen from '@island.is/web/screens/Adgerdir/Home'

export default withApollo(withLocale('en')(adgerdirHomeScreen))

import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import categoryScreen from '@island.is/web/screens/Category/Category'

export default withApollo(withLocale('en')(categoryScreen))

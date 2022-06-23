import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import categoriesScreen from '@island.is/web/screens/Category/Categories'

export default withApollo(withLocale('en')(categoriesScreen))

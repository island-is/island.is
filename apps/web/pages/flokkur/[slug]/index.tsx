import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import categoryScreen from '../../../screens/Category/Category'

export default withApollo(withLocale('is')(categoryScreen))

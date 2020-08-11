import { withLocale } from '@island.is/web/i18n'
import categoryScreen from '../../../../screens/Category/Category'
import { withApollo } from '@island.is/web/graphql'

export default withApollo(withLocale('en')(categoryScreen))

import { withLocale } from '@island.is/web/i18n'
import searchScreen from '../../../screens/Search/Search'
import { withApollo } from '@island.is/web/graphql'

export default withApollo(withLocale('is')(searchScreen))

import { withLocale } from '@island.is/web/i18n'
import homeScreen from '../../screens/Home'
import { withApollo } from '@island.is/web/graphql'

export default withApollo(withLocale('en')(homeScreen))

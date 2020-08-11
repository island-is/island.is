import { withLocale } from '../i18n'
import homeScreen from '../screens/Home'
import { withApollo } from '../graphql'

export default withApollo(withLocale('is')(homeScreen))

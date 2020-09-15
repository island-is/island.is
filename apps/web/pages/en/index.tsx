import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import homeScreen from '../../screens/Home'

export default withApollo(withLocale('en')(homeScreen))

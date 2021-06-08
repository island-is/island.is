import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import loginScreen from '@island.is/web/screens/Login/Login'

export default withApollo(withLocale('is')(loginScreen))

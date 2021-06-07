import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import serviceWebPage from '@island.is/web/screens/ServiceWeb/ServiceWeb'

export default withApollo(withLocale('is')(serviceWebPage))

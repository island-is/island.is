import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import serviceWebHomePage from '@island.is/web/screens/ServiceWeb/Home/Home'

export default withApollo(withLocale('is')(serviceWebHomePage))

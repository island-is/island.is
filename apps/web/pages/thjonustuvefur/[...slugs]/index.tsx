import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import serviceWebSubPage from '@island.is/web/screens/ServiceWeb/SubPage/SubPage'

export default withApollo(withLocale('is')(serviceWebSubPage))

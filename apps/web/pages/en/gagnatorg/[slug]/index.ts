import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import OpenDataSubPage from '@island.is/web/screens/OpenDataSubPage/OpenDataSubPage'

export default withApollo(withLocale('en')(OpenDataSubPage))

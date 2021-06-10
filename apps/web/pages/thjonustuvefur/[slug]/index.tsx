import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import serviceWebCategoryPage from '@island.is/web/screens/ServiceWeb/Category/Category'

export default withApollo(withLocale('is')(serviceWebCategoryPage))

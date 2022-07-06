import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import serviceWebFormsPage from '@island.is/web/screens/ServiceWeb/Forms/Forms'

export default withApollo(withLocale('is')(serviceWebFormsPage))

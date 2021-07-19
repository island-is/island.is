import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import contactFormsPage from '@island.is/web/screens/ServiceWeb/ContactForms/ContactForms'

export default withApollo(withLocale('is')(contactFormsPage))
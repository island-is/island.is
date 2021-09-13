import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import syslumennFormsPage from '@island.is/web/screens/ServiceWeb/ContactForms/SyslumennForms'

export default withApollo(withLocale('is')(syslumennFormsPage))

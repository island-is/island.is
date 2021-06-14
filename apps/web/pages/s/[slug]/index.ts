import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import organizationPage from '@island.is/web/screens/Organization/Home'

export default withApollo(withLocale('is')(organizationPage))

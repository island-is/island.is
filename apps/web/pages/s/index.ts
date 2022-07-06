import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import organizationsScreen from '@island.is/web/screens/Organizations/Organizations'

export default withApollo(withLocale('is')(organizationsScreen))

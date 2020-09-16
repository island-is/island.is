import { withApollo } from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n/withLocale'
import articleScreen from '@island.is/web/screens/Article'

export default withApollo(withLocale('is')(articleScreen))

import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import syslumenn from '@island.is/web/screens/Syslumenn/Home'

export default withApollo(withLocale('is')(syslumenn))

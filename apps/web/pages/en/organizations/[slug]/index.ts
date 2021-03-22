import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import syslumenn from '@island.is/web/screens/Organization/Home'

export default withApollo(withLocale('en')(syslumenn))

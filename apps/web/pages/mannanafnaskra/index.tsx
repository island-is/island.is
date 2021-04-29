import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import icelandicNamesScreen from '@island.is/web/screens/IcelandicNames'

export default withApollo(withLocale('is')(icelandicNamesScreen))

import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import Samradsgatt from '@island.is/web/screens/Samradsgatt/Samradsgatt'

export default withApollo(withLocale('is')(Samradsgatt))

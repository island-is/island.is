import '@island.is/api/mocks'

import withApollo from '../../graphql/withApollo'
import { withLocale } from '../../i18n'
import articleScreen from '../../screens/Article'

export default withApollo(withLocale('is')(articleScreen))

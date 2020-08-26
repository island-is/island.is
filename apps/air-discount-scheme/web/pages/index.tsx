import { withLocale } from '../i18n'
import { Home } from '../screens'
import { withApollo } from '../graphql/withApollo'

export default withApollo(withLocale('is')(Home))

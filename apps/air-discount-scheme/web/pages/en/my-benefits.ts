import { withLocale } from '../../i18n'
import { Subsidy } from '../../screens'
import { withAuth } from '../../auth'
import { withApollo } from '../../graphql/withApollo'

export default withApollo(withLocale('en')(withAuth(Subsidy)))

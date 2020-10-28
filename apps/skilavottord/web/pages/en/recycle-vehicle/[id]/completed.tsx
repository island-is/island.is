import { Screen } from '@island.is/skilavottord-web/types'
import { withLocale } from '@island.is/skilavottord-web/i18n'
import { Completed } from '@island.is/skilavottord-web/screens/Completed'
import { withApollo } from '@island.is/skilavottord-web/graphql/withApollo'
import { withAuth } from '@island.is/skilavottord-web/auth'

export default withApollo(
  withAuth(withLocale('en')(Completed as Screen), 'citizen'),
)

import { Screen } from '@island.is/skilavottord-web/types'
import { withLocale } from '@island.is/skilavottord-web/i18n'
import { Handover } from '@island.is/skilavottord-web/screens'
import { withApollo } from '@island.is/skilavottord-web/graphql/withApollo'
import { withAuth } from '@island.is/skilavottord-web/auth'

export default withApollo(
  withAuth(withLocale('is')(Handover as Screen), 'citizen'),
)

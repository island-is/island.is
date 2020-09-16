import { Screen } from '@island.is/skilavottord-web/types'
import { withLocale } from '@island.is/skilavottord-web/i18n'
import { Confirm } from '@island.is/skilavottord-web/screens/Confirm'
import { withApollo } from '@island.is/skilavottord-web/graphql/withApollo'
import { withAuth } from '@island.is/skilavottord-web/auth'

export default withApollo(withAuth(withLocale('en')(Confirm as Screen)))

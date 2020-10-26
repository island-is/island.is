import { Screen } from '@island.is/skilavottord-web/types'
import { withLocale } from '@island.is/skilavottord-web/i18n'
import { EditCompanyInfo } from '@island.is/skilavottord-web/screens'
import { withAuth } from '@island.is/skilavottord-web/auth'
import { withApollo } from '@island.is/skilavottord-web/graphql/withApollo'

export default withApollo(
  withAuth(withLocale('is')(EditCompanyInfo as Screen), 'recyclingPartner'),
)

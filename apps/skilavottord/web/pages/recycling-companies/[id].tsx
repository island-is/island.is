import { Screen } from '@island.is/skilavottord-web/types'
import { withLocale } from '@island.is/skilavottord-web/i18n'
import { RecyclingCompanyUpdate } from '@island.is/skilavottord-web/screens/RecyclingCompanies/RecyclingCompanyUpdate'
import { withAuth } from '@island.is/skilavottord-web/auth'

export default withAuth(
  withLocale('is')(RecyclingCompanyUpdate as Screen),
  'recyclingPartner',
)

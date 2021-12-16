import { Screen } from '@island.is/skilavottord-web/types'
import { withLocale } from '@island.is/skilavottord-web/i18n'
import { withAuth } from '@island.is/skilavottord-web/auth'
import { RecyclingCompanyCreate } from '@island.is/skilavottord-web/screens/RecyclingCompanies/RecyclingCompanyCreate'

export default withAuth(
  withLocale('is')(RecyclingCompanyCreate as Screen),
  'recyclingPartner',
)

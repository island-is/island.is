import { Screen } from '@island.is/skilavottord-web/types'
import { withLocale } from '@island.is/skilavottord-web/i18n'
import { AddCompanyInfo } from '@island.is/skilavottord-web/screens'
import { withAuth } from '@island.is/skilavottord-web/auth'

export default withAuth(
  withLocale('en')(AddCompanyInfo as Screen),
  'recyclingPartner',
)

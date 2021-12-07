import { Screen } from '@island.is/skilavottord-web/types'
import { withLocale } from '@island.is/skilavottord-web/i18n'
import { AccessControl } from '@island.is/skilavottord-web/screens'
import { withAuth } from '@island.is/skilavottord-web/auth'

export default withAuth(
  withLocale('en')(AccessControl as Screen),
  'recyclingPartner',
)

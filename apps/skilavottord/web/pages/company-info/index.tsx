import { Screen } from '@island.is/skilavottord-web/types'
import { withLocale } from '@island.is/skilavottord-web/i18n'
import { CompanyInfo } from '@island.is/skilavottord-web/screens'
import { withAuth } from '@island.is/skilavottord-web/auth'

export default withLocale('is')(CompanyInfo as Screen)

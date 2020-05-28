import { withLocale } from '../../../i18n'
import { CompanyApplication } from '../../../screens'
import { Screen } from '../../../types'
import { withAuth } from '../../../auth'

export default withLocale('is')(withAuth(CompanyApplication as Screen))

import { withLocale } from '../../i18n'
import { AdminUserApplication } from '../../screens'
import { Screen } from '../../types'
import { withAuth } from '../../auth'

export default withLocale('is')(withAuth(AdminUserApplication as Screen))

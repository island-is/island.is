import { withLocale } from '../../i18n'
import { AdminApplication } from '../../screens'
import { Screen } from '../../types'
import { withAuth } from '../../auth'

export default withLocale('is')(withAuth(AdminApplication as Screen))

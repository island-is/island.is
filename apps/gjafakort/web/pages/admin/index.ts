import { withLocale } from '../../i18n'
import { Admin } from '../../screens'
import { Screen } from '../../types'
import { withAuth } from '../../auth'

export default withLocale('is')(withAuth(Admin as Screen))

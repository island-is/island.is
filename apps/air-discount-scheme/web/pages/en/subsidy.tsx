import { withLocale } from '../../i18n'
import { Subsidy } from '../../screens'
import { Screen } from '../../types'
import { withAuth } from '../../auth'

export default withLocale('en')(withAuth(Subsidy as Screen))

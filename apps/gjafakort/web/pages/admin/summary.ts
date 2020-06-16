import { withLocale } from '../../i18n'
import { Summary } from '../../screens'
import { Screen } from '../../types'
import { withAuth } from '../../auth'

export default withLocale('is')(withAuth(Summary as Screen))

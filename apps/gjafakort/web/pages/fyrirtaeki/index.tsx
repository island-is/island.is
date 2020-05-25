import { withLocale } from '../../i18n'
import { Companies } from '../../screens'
import { Screen } from '../../types'
import { withAuth } from '../../auth'

export default withLocale('is')(withAuth(Companies as Screen))

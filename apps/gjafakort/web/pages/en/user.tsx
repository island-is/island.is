import { withLocale } from '../../i18n'
import { User } from '../../screens'
import { Screen } from '../../types'
import { withAuth } from '../../auth'

export default withLocale('en')(withAuth(User as Screen))

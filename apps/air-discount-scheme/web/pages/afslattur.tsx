import { withLocale } from '../i18n'
import { Home } from '../screens'
import { Screen } from '../types'
import { withAuth } from '../auth'

export default withLocale('is')(withAuth(Home as Screen))

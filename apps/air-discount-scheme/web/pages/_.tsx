import { Auth } from '../screens'
import { withAuth } from '../auth'
import { withLocale } from '../i18n'
import { Screen } from '../types'
import '../auth'

export default withLocale('is', 'auth')(withAuth(Auth as Screen))

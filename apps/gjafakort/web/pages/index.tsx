import { withLocale } from '../i18n'
import { HomePage } from '../screens'
import { Screen } from '../types'
import { withAuth } from '../auth'

export default withLocale('is')(withAuth(HomePage as Screen))

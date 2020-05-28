import { withLocale } from '../i18n'
import { Application } from '../screens'
import { Screen } from '../types'
import { withAuth } from '../auth'

export default withLocale('is')(withAuth(Application as Screen))

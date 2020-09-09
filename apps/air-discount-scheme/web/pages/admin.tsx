import { withLocale } from '../i18n'
import { Admin } from '../screens'
import { withAuth } from '../auth'

export default withLocale('is', 'admin')(withAuth(Admin))

import { withLocale } from '../i18n'
import { Subsidy } from '../screens'
import { withAuth } from '../auth'

export default withLocale('is', '/en/my-benefits')(withAuth(Subsidy))

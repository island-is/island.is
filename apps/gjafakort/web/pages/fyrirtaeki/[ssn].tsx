import { withLocale } from '../../i18n'
import { Company } from '../../screens'
import { Screen } from '../../types'
import { withAuth } from '../../auth'

export default withLocale('is')(withAuth(Company as Screen))

import { Screen } from '@island.is/skilavottord-web/types'
import { withLocale } from '@island.is/skilavottord-web/i18n'
import { Overview } from '@island.is/skilavottord-web/screens/Overview'
import { withAuth } from '@island.is/skilavottord-web/auth'

export default withAuth(withLocale('is')(Overview as Screen), 'citizen')

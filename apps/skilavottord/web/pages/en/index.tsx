import { Screen } from '@island.is/skilavottord-web/types'
import { withLocale } from '@island.is/skilavottord-web/i18n'
import { Home } from '@island.is/skilavottord-web/screens'

export default withLocale('en')(Home as Screen)

import { Screen } from '@island.is/skilavottord-web/types'
import { withLocale } from '@island.is/skilavottord-web/i18n'
import { Completed } from '@island.is/skilavottord-web/screens/Completed'

export default withLocale('is')(Completed as Screen)

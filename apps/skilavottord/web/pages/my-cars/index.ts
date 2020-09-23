import { Screen } from '@island.is/skilavottord-web/types'
import { withLocale } from '@island.is/skilavottord-web/i18n'
import { Overview } from '@island.is/skilavottord-web/screens/Overview'

export default withLocale('is')(Overview as Screen)

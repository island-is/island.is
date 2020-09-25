import { Screen } from '@island.is/skilavottord-web/types'
import { withLocale } from '@island.is/skilavottord-web/i18n'
import { Companies } from '@island.is/skilavottord-web/screens/Companies'

export default withLocale('is')(Companies as Screen)

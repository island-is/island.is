import { Screen } from '@island.is/skilavottord-web/types'
import { withLocale } from '@island.is/skilavottord-web/i18n'
import { AccessControl } from '@island.is/skilavottord-web/screens'

export default withLocale('is')(AccessControl as Screen)

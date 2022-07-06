import { Screen } from '@island.is/skilavottord-web/types'
import { withLocale } from '@island.is/skilavottord-web/i18n'
import { Overview } from '@island.is/skilavottord-web/screens/Overview'
import { withGDPR } from '@island.is/skilavottord-web/components'

export default withLocale('en')(withGDPR(Overview as Screen))

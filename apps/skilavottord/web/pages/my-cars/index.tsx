import { Screen } from '@island.is/skilavottord-web/types'
import { withLocale } from '@island.is/skilavottord-web/i18n'
import { CarsOverview } from '@island.is/skilavottord-web/screens/CarsOverview'

export default withLocale('is')(CarsOverview as Screen)
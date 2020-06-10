import { withLocale } from '../../i18n'
import homeScreen from '../../screens/Home'
import { Screen } from '../../types'

export default withLocale('en')(homeScreen as Screen)

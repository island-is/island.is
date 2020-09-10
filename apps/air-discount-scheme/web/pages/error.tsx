import { withLocale } from '../i18n'
import { ErrorPage } from '../screens'
import { Screen } from '../types'

export default withLocale(null, 'error')(ErrorPage as Screen)

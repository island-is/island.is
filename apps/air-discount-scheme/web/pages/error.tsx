import { withLocale } from '../i18n'
import { ErrorPage } from '../screens'
import { Screen } from '../types'

export default withLocale('is', 'error')(ErrorPage as Screen)

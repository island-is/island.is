import { withLocale } from '../i18n'
import { HomePage } from '../screens'
import { Screen } from '../screens/types';

export default withLocale('is')(HomePage as Screen)

import { withLocale } from '../i18n'
import { ErrorPage, Subsidy } from '../screens'
import { withAuth } from '../auth'

//export default withLocale('is', 'myBenefits')((ErrorPage))
export default withLocale('is', 'myBenefits')(withAuth(Subsidy))
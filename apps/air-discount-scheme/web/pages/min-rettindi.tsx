import { withLocale } from '../i18n'
import { ErrorPage, Subsidy } from '../screens'
import { withAuth } from '../auth'
console.log('inside min rettindi before withauth')
//export default withLocale('is', 'myBenefits')((ErrorPage))

export default withLocale('is', 'myBenefits')(withAuth(Subsidy))
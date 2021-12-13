import { withLocale } from '../i18n'
import { ErrorPage, Subsidy } from '../screens'
import { withAuth } from '../auth'
import { useSession } from 'next-auth/client'
console.log('inside min rettindi before withauth')
//export default withLocale('is', 'myBenefits')((ErrorPage))

export default withLocale('is', 'myBenefits')(withAuth(Subsidy))
// const MinRettindi = () => {
//   //const { data: session } = useSession()
//   return withLocale('is', 'myBenefits')(withAuth(Subsidy))
// }
// MinRettindi.auth = true

// export default MinRettindi

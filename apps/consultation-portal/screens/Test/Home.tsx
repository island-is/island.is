import { Screen } from '../../types'
import { ConsultationPortalAllCasesQuery } from '../Home/getAllCases.generated'

interface HomeProps {
  cases: ConsultationPortalAllCasesQuery['consultationPortalAllCases']
}

const Home: Screen<HomeProps> = ({ cases }) => {
  return <div>Test</div>
}

export default Home

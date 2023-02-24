import { IntroHeader } from '@island.is/portals/core'
import TenantsList from '../components/TenantsList/TenantsList'

const IDSAdmin = () => {
  return (
    <div id="test-domainList">
      <IntroHeader
        title="Innskráningarkerfi"
        intro="Veldu það domain sem þú villt skoða frekar"
      />
      <TenantsList />
    </div>
  )
}

export default IDSAdmin

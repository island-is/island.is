import { IntroHeader } from '@island.is/portals/core'
import DomainList from '../components/DomainList/DomainList'

const IDSAdmin = () => {
  return (
    <div id="test-domainList">
      <IntroHeader
        title="Innskráningarkerfi"
        intro="Veldu það domain sem þú villt skoða frekar"
      />
      <DomainList />
    </div>
  )
}

export default IDSAdmin

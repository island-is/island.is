import { Box } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { MinistryList } from '../components/MinistryList'
import { ministryMessages as msg } from '../lib/messages'

const Home = () => {
  useNamespaces('ap.regulations-admin')

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={msg.title}
        intro={msg.intro}
        img="./assets/images/educationLicense.svg"
      />

      <MinistryList />
    </Box>
  )
}

export default Home

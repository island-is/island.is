import React from 'react'
import { useAuth } from '@island.is/auth/react'

import { Box, Button } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { IntroHeader, ServicePortalPath } from '@island.is/service-portal/core'
import { MinistryList } from '../components/MinistryList'
import { useHistory, generatePath } from 'react-router-dom'
import { ministryMessages as msg } from '../messages'

const Home = () => {
  useNamespaces('ap.regulations-admin')
  const history = useHistory()

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

import React from 'react'
import { defineMessages } from 'react-intl'
import { useAuth } from '@island.is/auth/react'

import { Box, Button } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroHeader, ServicePortalPath } from '@island.is/service-portal/core'
import { WIPRegulations } from '../components/WIPRegulations'
import { useHistory, generatePath } from 'react-router-dom'

const msg = defineMessages({
  title: { id: 'ap.regulations-admin:home-title' },
  intro: { id: 'ap.regulations-admin:home-intro' },
  test: { id: 'ap.regulations-admin:test' },
})

const Home = () => {
  useNamespaces('ap.regulations-admin')
  const { formatMessage } = useLocale()
  const { userInfo } = useAuth()
  const history = useHistory()

  return (
    <Box marginBottom={[6, 6, 10]}>
      <p>
        {formatMessage(msg.test)} {userInfo?.profile.name}
      </p>
      <IntroHeader
        title={msg.title}
        intro={msg.intro}
        img="./assets/images/educationLicense.svg"
      />
      <WIPRegulations />
      <Button
        colorScheme="default"
        iconType="filled"
        preTextIconType="filled"
        size="small"
        variant="primary"
        onClick={() =>
          history.push(generatePath(ServicePortalPath.RegulationsAdminNew))
        }
      >
        Skrá nýja reglugerð
      </Button>
      <Button
        colorScheme="default"
        iconType="filled"
        preTextIconType="filled"
        size="small"
        variant="primary"
        onClick={() =>
          history.push(
            // @ts-expect-error  (Bad typing in @types/react-router-dom)
            generatePath(ServicePortalPath.RegulationsAdminEdit, { id: 124 }),
          )
        }
      >
        Vinna með reglugerð 124
      </Button>
    </Box>
  )
}

export default Home

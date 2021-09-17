import * as s from './Home.treat'

import React from 'react'

import { Box, Button } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { IntroHeader, ServicePortalPath } from '@island.is/service-portal/core'
import { TaskList } from '../components/TaskList'
import { ShippedRegulations } from '../components/ShippedRegulations'
import { useHistory, generatePath } from 'react-router-dom'
import { homeMessages as msg } from '../messages'
import { useLocale } from '../utils'

const Home = () => {
  useNamespaces('ap.regulations-admin')
  const history = useHistory()
  const t = useLocale().formatMessage

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={msg.title}
        intro={msg.intro}
        img="./assets/images/educationLicense.svg"
      />

      <div className={s.newButtonBox}>
        <Button
          colorScheme="default"
          iconType="filled"
          preTextIconType="filled"
          size="small"
          variant="primary"
          onClick={() =>
            history.push(
              generatePath(ServicePortalPath.RegulationsAdminEdit, {
                id: 'new',
              }),
            )
          }
        >
          {t(msg.createRegulation)}
        </Button>
      </div>

      <TaskList />

      <ShippedRegulations />
    </Box>
  )
}

export default Home

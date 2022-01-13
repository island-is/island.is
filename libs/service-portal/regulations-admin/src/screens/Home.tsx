import * as s from './Home.css'

import React from 'react'

import { Box, Button } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { IntroHeader } from '@island.is/service-portal/core'
import { TaskList } from '../components/TaskList'
import { ShippedRegulations } from '../components/ShippedRegulations'
import { homeMessages as msg } from '../messages'
import { useLocale } from '../utils'
import { useCreateRegulationDraft } from '../utils/dataHooks'

const Home = () => {
  useNamespaces('ap.regulations-admin')
  const t = useLocale().formatMessage

  const { createNewDraft, creating, error } = useCreateRegulationDraft()

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
          disabled={creating}
          onClick={() => createNewDraft()}
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

import * as s from './Home.css'

import React from 'react'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
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
      <Box marginBottom={[4, 4, 8]}>
        <Text as="h1" variant="h1">
          {t(msg.title)}
        </Text>
        {msg.intro && (
          <Text as="p" marginTop={1}>
            {t(msg.intro)}
          </Text>
        )}
      </Box>

      {/* <IntroHeader title={msg.title} intro={msg.intro} /> */}

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

import * as s from './ButtonBar.treat'

import { Box, Button, Divider } from '@island.is/island-ui/core'
import React from 'react'
import { useIntl } from 'react-intl'
import { buttonsMsgs as msg } from '../messages'
import { UserRole } from '../types'
import { StepNav } from '../state/useDraftingState'
import { RegulationDraft } from '../types-api'

export type ButtonBarProps = {
  stepNav: StepNav
  actions: {
    saveStatus: () => void
    goBack?: () => void
    goForward?: () => void
    propose?: () => void
  }
}

export const ButtonBar = (props: ButtonBarProps) => {
  const { stepNav, actions } = props
  const { goBack, goForward, saveStatus, propose } = actions
  const t = useIntl().formatMessage

  return (
    <Box className={s.wrapper} marginTop={[4, 4, 6]} paddingTop={3}>
      {goForward && (
        <Box className={s.forward}>
          <Button onClick={goForward} icon="arrowForward" size="small">
            {t(stepNav.next === 'review' ? msg.prepShipping : msg.continue)}
          </Button>
        </Box>
      )}

      {goBack && (
        <Box className={s.back}>
          <Button
            onClick={goBack}
            preTextIcon="arrowBack"
            colorScheme="light"
            size="small"
          >
            {t(msg.goBack)}
          </Button>
        </Box>
      )}

      <Box className={s.save}>
        <Button onClick={saveStatus} icon={undefined} colorScheme="light">
          {t(msg.save)}
        </Button>
      </Box>

      {propose && (
        <Box className={s.propose}>
          <Button data-name="propose" onClick={propose}>
            {t(msg.propose)}
          </Button>
        </Box>
      )}
    </Box>
  )
}

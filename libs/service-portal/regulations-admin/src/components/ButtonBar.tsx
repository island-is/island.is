import * as s from './ButtonBar.treat'

import { Box, Button } from '@island.is/island-ui/core'
import React from 'react'
import { useIntl } from 'react-intl'
import { buttonsMsgs as msg } from '../messages'
import { StepNav } from '../state/useDraftingState'

export type ButtonBarProps = {
  stepNav: StepNav
  new?: boolean
  actions: {
    saveStatus: () => void
    createDraft: () => void
    goBack?: () => void
    goForward?: () => void
    propose?: () => void
  }
}

export const ButtonBar = (props: ButtonBarProps) => {
  const { stepNav, actions } = props
  const { goBack, goForward, saveStatus, createDraft, propose } = actions
  const t = useIntl().formatMessage

  return (
    <Box className={s.wrapper} marginTop={[4, 4, 6]} paddingTop={3}>
      {goForward && (
        <Box className={s.forward}>
          <Button
            onClick={goForward}
            icon="arrowForward"
            iconType="outline"
            size="small"
          >
            {t(stepNav.next === 'review' ? msg.prepShipping : msg.continue)}
          </Button>
        </Box>
      )}

      {goBack && (
        <Box className={s.back}>
          <Button
            onClick={goBack}
            preTextIcon="arrowBack"
            preTextIconType="outline"
            colorScheme="light"
            size="small"
          >
            {t(msg.goBack)}
          </Button>
        </Box>
      )}

      <Box className={s.save}>
        <Button
          onClick={props.new ? createDraft : saveStatus}
          preTextIcon="save"
          preTextIconType="outline"
          colorScheme="light"
        >
          {t(msg.save)}
        </Button>
      </Box>

      {propose && (
        <Box className={s.propose}>
          <Button
            onClick={propose}
            preTextIcon="share"
            preTextIconType="outline"
          >
            {t(msg.propose)}
          </Button>
        </Box>
      )}
    </Box>
  )
}

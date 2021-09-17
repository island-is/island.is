import * as s from './ButtonBar.treat'

import React from 'react'
import { Box, Button } from '@island.is/island-ui/core'
import { buttonsMsgs as msg } from '../messages'
import { StepNav } from '../state/types'
import { useLocale } from '../utils'
// import { SaveDeleteButtons } from './SaveDeleteButtons'

export type ButtonBarProps = {
  stepNav: StepNav
  id: string | undefined
  actions: {
    saveStatus: () => void
    deleteDraft: () => void
    goBack?: () => void
    goForward?: () => void
    propose?: () => void
  }
}

export const ButtonBar = (props: ButtonBarProps) => {
  const { stepNav, actions } = props
  const t = useLocale().formatMessage

  return (
    <Box className={s.wrapper} marginTop={[4, 4, 6]} paddingTop={3}>
      {actions.goForward && (
        <Box className={s.forward}>
          <Button
            onClick={actions.goForward}
            icon="arrowForward"
            iconType="outline"
          >
            {t(stepNav.next === 'review' ? msg.prepShipping : msg.continue)}
          </Button>
        </Box>
      )}

      {actions.goBack && (
        <Box className={s.back}>
          <Button
            onClick={actions.goBack}
            preTextIcon="arrowBack"
            preTextIconType="outline"
            colorScheme="light"
          >
            {t(msg.goBack)}
          </Button>
        </Box>
      )}

      {/*
      <SaveDeleteButtons id={props.id} actions={actions} classes={s} />
      */}

      {actions.propose && (
        <Box className={s.propose}>
          <Button
            onClick={actions.propose}
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

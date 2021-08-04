import * as s from './ButtonBar.treat'
import { useHistory } from 'react-router-dom'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { gql, useMutation } from '@apollo/client'
import { Box, Button } from '@island.is/island-ui/core'
import React from 'react'
import { useIntl } from 'react-intl'
import { buttonsMsgs as msg } from '../messages'
import { StepNav } from '../state/types'

export const DELETE_DRAFT_REGULATION_MUTATION = gql`
  mutation DeleteDraftRegulationMutation($input: DeleteDraftRegulationInput!) {
    deleteDraftRegulation(input: $input) {
      id
    }
  }
`

export type ButtonBarProps = {
  stepNav: StepNav
  id?: string
  actions: {
    saveStatus: () => void
    createDraft: () => void
    updateDraft: () => void
    goBack?: () => void
    goForward?: () => void
    propose?: () => void
  }
}

export const ButtonBar = (props: ButtonBarProps) => {
  const { stepNav, actions, id } = props
  const history = useHistory()
  const {
    goBack,
    goForward,
    saveStatus,
    createDraft,
    updateDraft,
    propose,
  } = actions
  const t = useIntl().formatMessage
  const [deleteDraftRegulationMutation] = useMutation(
    DELETE_DRAFT_REGULATION_MUTATION,
  )

  const onDeleteDraftRegulation = async () => {
    // TODO: Dialog opens to CONFIRM the deletion by user?
    if (id) {
      try {
        await deleteDraftRegulationMutation({
          variables: {
            input: {
              id,
            },
          },
        }).then(() => {
          // TODO: Láta notanda vita að færslu hefur verið eytt út?
          history.push(ServicePortalPath.RegulationsAdminRoot)
        })
      } catch (e) {
        console.error('delete draft regulation error: ', e)
        return
      }
    }
  }

  const newDraft = id === 'new'

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

      {!newDraft && (
        <Box className={s.save}>
          <Button
            onClick={onDeleteDraftRegulation}
            preTextIcon="trash"
            preTextIconType="outline"
            colorScheme="destructive"
          >
            {t(msg.delete)}
          </Button>
        </Box>
      )}

      <Box className={s.save}>
        <Button
          onClick={newDraft ? createDraft : updateDraft}
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

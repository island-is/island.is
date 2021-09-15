import * as s from './SaveDeleteButtons.treat'
import { Box, Button } from '@island.is/island-ui/core'
import React from 'react'
import { useIntl } from 'react-intl'
import { buttonsMsgs as msg } from '../messages'

// ===========================================================================

export type SaveDeleteButtonsProps = {
  id: string | undefined
  actions: {
    saveStatus: () => void
    deleteDraft: () => void
  }
} & (
  | { wrap: true; classes?: undefined }
  | {
      wrap?: false
      classes: {
        deleteDraft: string
        saveDraft: string
      }
    }
)

export const SaveDeleteButtons = (props: SaveDeleteButtonsProps) => {
  const { id, actions, wrap, classes = s } = props
  const t = useIntl().formatMessage

  const newDraft = id === 'new'

  const buttons = (
    <>
      {!newDraft && (
        <Box className={classes.deleteDraft}>
          <Button
            onClick={actions.deleteDraft}
            icon="trash"
            iconType="outline"
            variant="text"
            colorScheme="destructive"
            size="small"
          >
            {t(msg.delete)}
          </Button>
        </Box>
      )}{' '}
      <Box className={classes.saveDraft}>
        <Button
          onClick={actions.saveStatus}
          icon="save"
          iconType="outline"
          variant="text"
          size="small"
        >
          {t(msg.save)}
        </Button>
      </Box>
    </>
  )

  return wrap ? (
    <Box
      marginBottom={[3, 3, 4]}
      display="flex"
      flexDirection="row"
      justifyContent="flexEnd"
    >
      {buttons}
    </Box>
  ) : (
    buttons
  )
}

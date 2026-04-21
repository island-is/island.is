import React from 'react'
import { Box, DialogPrompt, Icon, Tag } from '@island.is/island-ui/core'
import { coreMessages } from '@island.is/application/core'
import { ApplicationCardFields } from '../types'
import { useLocale } from '@island.is/localization'
import { useDeleteApplication } from '../../../hooks/useDeleteApplication'

interface Props {
  application: ApplicationCardFields
  onDelete?: () => void
}

export const ApplicationCardDelete = ({ application, onDelete }: Props) => {
  const { id, actionCard, typeId } = application
  const { formatMessage } = useLocale()
  const { deleteApplication } = useDeleteApplication(onDelete)

  if (!actionCard || !actionCard?.deleteButton) {
    return null
  }
  return (
    <DialogPrompt
      baseId="delete_dialog"
      title={formatMessage(coreMessages.deleteApplicationDialogTitle)}
      description={formatMessage(
        coreMessages.deleteApplicationDialogDescription,
      )}
      ariaLabel={formatMessage(coreMessages.deleteApplicationDialogTitle)}
      img={
        <img
          src="assets/images/settings.svg"
          alt="globe"
          style={{ float: 'right' }}
          width="80%"
        />
      }
      disclosureElement={
        <Tag outlined={false} variant="red">
          <Box display="flex" flexDirection="row" alignItems="center">
            <Icon icon="trash" size="small" type="outline" />
          </Box>
        </Tag>
      }
      onConfirm={() => deleteApplication(id, typeId)}
      buttonTextConfirm={formatMessage(
        coreMessages.deleteApplicationDialogConfirmLabel,
      )}
      buttonTextCancel={formatMessage(
        coreMessages.deleteApplicationDialogCancelLabel,
      )}
    />
  )
}

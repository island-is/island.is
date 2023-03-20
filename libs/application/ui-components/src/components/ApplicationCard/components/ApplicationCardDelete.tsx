import { Box, DialogPrompt, Icon, Tag } from '@island.is/island-ui/core'
import { coreMessages, useDeleteApplication } from '@island.is/application/core'
import { ApplicationCardFields } from '../types'
import { useLocale } from '@island.is/localization'

interface Props {
  application: ApplicationCardFields
  refetchOnDelete?: () => void
}

export const ApplicationCardDelete = ({
  application,
  refetchOnDelete,
}: Props) => {
  const { id, actionCard } = application
  const { formatMessage } = useLocale()
  const { deleteApplication } = useDeleteApplication(refetchOnDelete)

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
          src="assets/images/settings.svg`"
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
      onConfirm={() => deleteApplication(id)}
      buttonTextConfirm={formatMessage(
        coreMessages.deleteApplicationDialogConfirmLabel,
      )}
      buttonTextCancel={formatMessage(
        coreMessages.deleteApplicationDialogCancelLabel,
      )}
    />
  )
}

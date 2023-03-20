import { Box, DialogPrompt, Icon, Tag } from '@island.is/island-ui/core'
import { ApplicationCardProps } from '../ApplicationCard'

interface Props {
  deleteButton?: ApplicationCardProps['deleteButton']
  tag?: ApplicationCardProps['tag']
}

export const ApplicationCardDelete = ({ deleteButton, tag }: Props) => {
  if (!deleteButton || !deleteButton.visible) {
    return null
  }

  return (
    <DialogPrompt
      baseId="delete_dialog"
      title={deleteButton.dialogTitle ?? ''}
      description={deleteButton.dialogDescription}
      ariaLabel="delete"
      img={
        <img
          src={`assets/images/settings.svg`}
          alt={'globe'}
          style={{ float: 'right' }}
          width="80%"
        />
      }
      disclosureElement={
        <Tag outlined={tag?.outlined} variant={tag?.variant}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Icon icon="trash" size="small" type="outline" />
          </Box>
        </Tag>
      }
      onConfirm={deleteButton.onClick}
      buttonTextConfirm={deleteButton.dialogConfirmLabel}
      buttonTextCancel={deleteButton.dialogCancelLabel}
    />
  )
}

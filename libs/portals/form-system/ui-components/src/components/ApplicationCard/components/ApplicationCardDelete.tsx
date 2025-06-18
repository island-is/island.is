import { Box, DialogPrompt, Icon, Tag } from '@island.is/island-ui/core'
import { coreMessages } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { FormSystemApplication } from '@island.is/api/schema'

interface Props {
  application: FormSystemApplication
  onDelete?: () => void
}

export const ApplicationCardDelete = ({ application: _application }: Props) => {
  const { formatMessage } = useLocale()

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
      buttonTextConfirm={formatMessage(
        coreMessages.deleteApplicationDialogConfirmLabel,
      )}
      buttonTextCancel={formatMessage(
        coreMessages.deleteApplicationDialogCancelLabel,
      )}
    />
  )
}

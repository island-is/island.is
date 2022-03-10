import React, { FC } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box, Text, Stack, Icon, Button } from '@island.is/island-ui/core'
import { useFormContext } from 'react-hook-form'
import { YES, NO } from '../../constants'
import * as styles from './SecondaryContact.css'
import { useLocale } from '@island.is/localization'
import { institutionApplicationMessages as m } from '../../lib/messages'
const SecondaryContact: FC<FieldBaseProps> = ({ field, application }) => {
  const { setValue, getValues } = useFormContext()
  const { formatMessage } = useLocale()
  const { id, title } = field
  const isEnabled = getValues('hasSecondaryContact') === YES

  const enableSecondaryContact = () => {
    setValue('hasSecondaryContact', YES)
  }

  const disableSecondaryContact = () => {
    setValue('hasSecondaryContact', NO)
    setValue(`${id}.name`, undefined)
    setValue(`${id}.phoneNumber`, undefined)
    setValue(`${id}.email`, undefined)
  }

  return isEnabled ? (
    <Box marginTop={4}>
      <Stack space={3}>
        <Box display="flex" position="relative" alignItems="center">
          <Box className={styles.deleteIcon} onClick={disableSecondaryContact}>
            <Icon
              color="dark200"
              icon="removeCircle"
              size="medium"
              type="outline"
            />
          </Box>
          <Text variant="h4">
            {formatText(title, application, formatMessage)}
          </Text>
        </Box>
      </Stack>
    </Box>
  ) : (
    <Box marginTop={4}>
      <Button
        icon="add"
        variant="ghost"
        size="small"
        onClick={enableSecondaryContact}
      >
        {formatText(
          m.applicant.contactAddButtonLabel,
          application,
          formatMessage,
        )}
      </Button>
    </Box>
  )
}

export default SecondaryContact

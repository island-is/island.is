import * as styles from './SecondaryContact.css'

import { Box, Button, Icon, Stack, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'

import { FieldBaseProps } from '@island.is/application/types'
import {
  formatText,
  formatTextWithLocale,
  NO,
  YES,
} from '@island.is/application/core'
import { institutionApplicationMessages as m } from '../../lib/messages'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'

const SecondaryContact: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  field,
  application,
}) => {
  const { setValue, getValues } = useFormContext()
  const { formatMessage, lang: locale } = useLocale()
  const { id, title = '' } = field
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
            {formatTextWithLocale(
              title,
              application,
              locale as Locale,
              formatMessage,
            )}
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

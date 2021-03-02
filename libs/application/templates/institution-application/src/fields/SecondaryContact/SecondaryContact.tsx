import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Stack, Icon, Button } from '@island.is/island-ui/core'
import { useFormContext } from 'react-hook-form'
import { YES, NO } from '../../constants'
import * as styles from './SecondaryContact.treat'

const SecondaryContact: FC<FieldBaseProps> = ({ field }) => {
  const { setValue, getValues } = useFormContext()
  const { id } = field
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

  return (
    <>
      {isEnabled ? (
        <Box marginTop={4}>
          <Stack space={3}>
            <Box
              marginBottom={2}
              display="flex"
              position="relative"
              alignItems="center"
            >
              <Box
                className={styles.deleteIcon}
                onClick={disableSecondaryContact}
              >
                <Icon
                  color="dark200"
                  icon="removeCircle"
                  size="medium"
                  type="outline"
                />
              </Box>
              <Text variant="h4">Upplysingar tengiliðs 2</Text>
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
            Bæta við tengilið
          </Button>
        </Box>
      )}
    </>
  )
}

export default SecondaryContact

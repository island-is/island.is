import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { SelectController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'

type FilesRecipientCardProps = {
  field: {
    props: {
      noOptions: boolean
    }
  }
}

export const FilesRecipientCard: FC<
  FieldBaseProps & FilesRecipientCardProps
> = ({ application, errors, field }) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      marginTop={2}
      padding={3}
      borderRadius="large"
      borderColor="blue200"
      border="standard"
    >
      {field.title && (
        <Text variant="h4" as="h3" marginBottom={1}>
          {field.title}
        </Text>
      )}
      {field.description && <Text>{field.description}</Text>}
      {!field?.props?.noOptions && (
        <Box marginTop={3}>
          <SelectController
            label="Erfingi"
            id={field.id}
            name={field.id}
            backgroundColor="blue"
            defaultValue={field.defaultValue}
            options={(application.answers.estateMembers as {
              nationalId: string
              relation: string
            }[])?.map((estateMember) => ({
              label: estateMember.nationalId,
              value: estateMember.nationalId,
            }))}
          />
        </Box>
      )}
    </Box>
  )
}

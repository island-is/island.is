import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { SelectController } from '@island.is/shared/form-fields'
import {
  FieldBaseProps,
  formatText,
  FormText,
} from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'

type FilesRecipientCardProps = {
  field: {
    props: {
      noOptions: boolean
      placeholder?: FormText
    }
  }
}

export const FilesRecipientCard: FC<
  FieldBaseProps & FilesRecipientCardProps
> = ({ application, field }) => {
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
          {formatText(field.title, application, formatMessage)}
        </Text>
      )}
      {field.description && (
        <Text>{formatText(field.description, application, formatMessage)}</Text>
      )}
      {!field?.props?.noOptions && (
        <Box marginTop={3}>
          <SelectController
            label={formatText(
              m.filesRecipientLabel,
              application,
              formatMessage,
            )}
            id={field.id}
            name={field.id}
            backgroundColor="blue"
            defaultValue={field.defaultValue}
            placeholder={
              field.props.placeholder
                ? formatText(
                    field.props.placeholder,
                    application,
                    formatMessage,
                  )
                : ''
            }
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

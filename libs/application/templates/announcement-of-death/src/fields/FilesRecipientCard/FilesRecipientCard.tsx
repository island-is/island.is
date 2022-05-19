import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { SelectController } from '@island.is/shared/form-fields'
import {
  Application,
  FieldBaseProps,
  formatText,
  FormText,
  FormValue,
} from '@island.is/application/core'
import { Box, Tag, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { Answers as AODAnswers } from '../../types'
import { FieldValue } from 'aws-sdk/clients/cloudsearch'

type FilesRecipientCardProps = {
  field: {
    props: {
      noOptions: boolean
      placeholder?: FormText
      tag?: (application: Application<AODAnswers>) => string
    }
  }
}

export const FilesRecipientCard: FC<
  FieldBaseProps<AODAnswers> & FilesRecipientCardProps
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
            defaultValue={field.defaultValue || ''}
            placeholder={
              field.props.placeholder
                ? formatText(
                    field.props.placeholder,
                    application,
                    formatMessage,
                  )
                : ''
            }
            options={
              application.answers?.estateMembers.length !== 0
                ? application.answers?.estateMembers?.map((estateMember) => ({
                    label: estateMember.name,
                    value: estateMember.name,
                  }))
                : [
                    {
                      label: application.answers.applicantName,
                      value: application.answers.applicantName,
                    },
                  ]
            }
          />
        </Box>
      )}
      {field.props.tag && (
        <Box marginTop={1}>
          <Tag disabled>{field.props.tag(application)}</Tag>
        </Box>
      )}
    </Box>
  )
}

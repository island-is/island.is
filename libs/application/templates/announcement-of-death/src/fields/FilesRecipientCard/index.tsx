import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { SelectController } from '@island.is/shared/form-fields'
import { formatText } from '@island.is/application/core'
import {
  Application,
  FieldBaseProps,
  FormText,
} from '@island.is/application/types'
import { Box, Tag, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { Answers as AODAnswers } from '../../types'
import { isPerson } from 'kennitala'

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
  React.PropsWithChildren<FieldBaseProps<AODAnswers> & FilesRecipientCardProps>
> = ({ application, field }) => {
  const { formatMessage } = useLocale()
  let options =
    application.answers?.estateMembers?.members?.length &&
    application.answers.estateMembers.members.length !== 0
      ? application.answers?.estateMembers?.members
          .filter((member) => !member?.dummy)
          .map((estateMember) => ({
            label: estateMember.name,
            value: estateMember.nationalId,
          }))
      : []

  options = options.filter((member) => isPerson(member.value))

  if (
    field.id !== 'financesDataCollectionPermission' &&
    !application.answers?.estateMembers?.members.find(
      (member) => member.nationalId === application.applicant,
    )
  ) {
    options.push({
      label: application.answers.applicantName,
      value: application.applicant,
    })
  }

  // Add the option for selecting noone
  options.push({
    label: formatMessage(m.selectOptionNobody),
    value: '',
  })

  return (
    <Box
      marginBottom={5}
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
            options={options}
          />
        </Box>
      )}
      {field.props.tag && (
        <Box marginTop={1}>
          <Tag disabled>
            {field.props.tag(application) === ''
              ? formatMessage(m.selectOptionNobody)
              : field.props.tag(application)}
          </Tag>
        </Box>
      )}
    </Box>
  )
}

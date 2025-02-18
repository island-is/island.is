import React from 'react'
import { useIntl } from 'react-intl'

import { Text, Box, Input } from '@island.is/island-ui/core'

import { DescriptionText } from '..'
import {
  FAFieldBaseProps,
  SummaryComment as SummaryCommentType,
} from '../../lib/types'
import { childrenForm } from '../../lib/messages'

import { ChildInput } from './ChildInput'
import { sortChildrenUnderAgeByAge } from '../../lib/utils'
import { Controller, useFormContext } from 'react-hook-form'

const ChildrenForm = ({ application, field, errors }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { setValue } = useFormContext()

  const { externalData, answers } = application
  const childrenExternalData = externalData.childrenCustodyInformation.data
  const childrenInfo = sortChildrenUnderAgeByAge(childrenExternalData)
  const summaryCommentType = SummaryCommentType.CHILDRENCOMMENT

  return (
    <>
      <Text variant="h3" fontWeight="light" marginBottom={3}>
        {formatMessage(childrenForm.general.description)}
      </Text>
      <Box marginBottom={5}>
        <DescriptionText text={childrenForm.page.content} />
      </Box>

      {childrenInfo?.map((child, index) => {
        const fieldIndex = `${field.id}[${index}]`

        setValue(`${fieldIndex}.livesWithApplicant`, child.livesWithApplicant)
        setValue(
          `${fieldIndex}.livesWithBothParents`,
          child.livesWithBothParents,
        )

        return (
          <ChildInput
            fieldIndex={fieldIndex}
            errors={errors}
            childFullName={child.fullName}
            childNationalId={child.nationalId}
          />
        )
      })}

      <Box
        marginTop={[3, 3, 4]}
        marginBottom={4}
        background="blue100"
        padding={3}
        borderRadius="standard"
      >
        <Box marginBottom={4}>
          <Text as="h3" variant="h3">
            {formatMessage(childrenForm.page.commentTitle)}
          </Text>
          <Text variant="small">
            {formatMessage(childrenForm.page.commentText)}
          </Text>
        </Box>

        <Controller
          name={summaryCommentType}
          defaultValue={answers?.childrenComment}
          render={({ field: { onChange, value } }) => {
            return (
              <Input
                id={summaryCommentType}
                name={summaryCommentType}
                label={formatMessage(childrenForm.inputs.commentLabel)}
                value={value}
                textarea={true}
                rows={8}
                backgroundColor="white"
                onChange={(e) => {
                  onChange(e.target.value)
                  setValue(summaryCommentType, e.target.value)
                }}
              />
            )
          }}
        />
      </Box>
    </>
  )
}

export default ChildrenForm

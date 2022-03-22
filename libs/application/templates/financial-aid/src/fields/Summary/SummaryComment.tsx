import React from 'react'
import { useIntl } from 'react-intl'
import { Controller, useFormContext } from 'react-hook-form'

import { Box, Input, Text } from '@island.is/island-ui/core'
import { summaryForm } from '../../lib/messages'
import { SummaryComment as SummaryCommentType } from '../../lib/types'

interface Props {
  commentId: SummaryCommentType
  comment?: string
}

const SummaryComment = ({ commentId, comment }: Props) => {
  const { formatMessage } = useIntl()
  const { setValue } = useFormContext()

  return (
    <>
      <Text as="h3" variant="h3">
        {formatMessage(summaryForm.formInfo.formCommentLabel)}
      </Text>
      <Box marginTop={[3, 3, 4]} marginBottom={4}>
        <Controller
          name={commentId}
          defaultValue={comment}
          render={({ value, onChange }) => {
            return (
              <Input
                id={commentId}
                name={commentId}
                label={formatMessage(summaryForm.formInfo.formCommentTitle)}
                placeholder={formatMessage(
                  summaryForm.formInfo.formCommentPlaceholder,
                )}
                value={value}
                textarea={true}
                rows={8}
                backgroundColor="blue"
                onChange={(e) => {
                  onChange(e.target.value)
                  setValue(commentId, e.target.value)
                }}
              />
            )
          }}
        />
      </Box>
    </>
  )
}

export default SummaryComment

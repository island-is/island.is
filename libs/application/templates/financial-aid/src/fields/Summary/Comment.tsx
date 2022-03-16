import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Input, Text } from '@island.is/island-ui/core'
import * as m from '../../lib/messages'
import { Controller, useFormContext } from 'react-hook-form'

interface Props {
  commentId: string
  comment: string
}

const ContactInfo = ({ commentId, comment }: Props) => {
  const { formatMessage } = useIntl()
  const { setValue } = useFormContext()

  return (
    <>
      <Text as="h3" variant="h3">
        {formatMessage(m.summaryForm.formInfo.formCommentLabel)}
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
                label={formatMessage(m.summaryForm.formInfo.formCommentTitle)}
                placeholder={formatMessage(
                  m.summaryForm.formInfo.formCommentPlaceholder,
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

export default ContactInfo

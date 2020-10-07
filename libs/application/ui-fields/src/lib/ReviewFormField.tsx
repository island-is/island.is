import React, { FC, useMemo } from 'react'
import { ReviewField, FieldBaseProps } from '@island.is/application/core'
import { Typography, Box } from '@island.is/island-ui/core'
import { RadioController } from '@island.is/shared/form-fields'

interface Props extends FieldBaseProps {
  field: ReviewField
}
const ReviewFormField: FC<Props> = ({ field, error }) => {
  const { id, name, actions } = field
  const actionsAsOptions = useMemo(() => {
    return actions.map((a) => {
      return { label: a.name, value: a.event as string }
    })
  }, [actions])
  return (
    <Box
      background="blue100"
      borderRadius="large"
      width="full"
      padding={4}
      marginTop={4}
    >
      <Typography variant="h4">{name}</Typography>
      <Box paddingTop={1}>
        <RadioController id={id} options={actionsAsOptions} error={error} />
      </Box>
    </Box>
  )
}

export default ReviewFormField

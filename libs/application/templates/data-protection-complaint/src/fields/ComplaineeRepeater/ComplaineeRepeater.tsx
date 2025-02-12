import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Text } from '@island.is/island-ui/core'
import React, { FC, useEffect } from 'react'
import { useLocale } from '@island.is/localization'
import { complaint } from '../../lib/messages'
import { useFieldArray } from 'react-hook-form'
import { ComplaineeRepeaterItem } from './ComplaineeRepeaterItem'
import { YES, NO } from '@island.is/application/core'

export type ComplaineeField = {
  name: string
  address: string
  nationalId: string
  operatesWithinEurope: typeof YES | typeof NO
  countryOfOperation: string
}

export const ComplaineeRepeater: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, field, errors }) => {
  const { formatMessage } = useLocale()
  const { answers } = application
  const { id } = field
  const { fields, append, remove } = useFieldArray({
    name: id,
  })

  useEffect(() => {
    // The repeater should include one line by default
    if (fields.length === 0) handleAddComplainee()
  }, [fields])

  const handleAddComplainee = () =>
    append({
      name: '',
      address: '',
      nationalId: '',
      operatesWithinEurope: undefined,
      countryOfOperation: '',
    })
  const handleRemoveComplainee = (index: number) => remove(index)

  return (
    <Box>
      {/* Removed for now because the message concerns asterisk fields which are not supported atm
      <FieldDescription
        description={formatMessage(complaint.general.complaineePageDescription)}
      /> */}
      {fields.map((field, index) => {
        return (
          <ComplaineeRepeaterItem
            id={id}
            application={application}
            answers={answers}
            field={field}
            index={index}
            key={field.id}
            handleRemoveComplainee={handleRemoveComplainee}
            errors={errors}
          />
        )
      })}
      <Text marginY={3}>
        {formatMessage(complaint.labels.complaineeAddPerson)}
      </Text>
      <Button
        variant="ghost"
        icon="add"
        iconType="outline"
        size="small"
        onClick={handleAddComplainee}
      >
        {formatMessage(complaint.labels.complaineeAdd)}
      </Button>
    </Box>
  )
}

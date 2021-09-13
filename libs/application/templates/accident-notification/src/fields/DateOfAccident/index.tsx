import { IsHealthInsuredInput } from '@island.is/api/schema'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Input } from '@island.is/island-ui/core'
import React, { useState, FC, useEffect, useCallback } from 'react'
import { useLazyIsHealthInsured } from '../../hooks/useLazyIsHealthInsured'
import { NO, YES } from '../../constants'
import { AccidentNotification } from '../../lib/dataSchema'
import { Controller, useFormContext } from 'react-hook-form'
import { DatePickerController } from '@island.is/shared/form-fields'
import { accidentDetails } from '../../lib/messages'

export const DateOfAccident: FC<FieldBaseProps> = ({
  application,
  field,
}: FieldBaseProps) => {
  const { id } = field
  const answers = application.answers as AccidentNotification
  const { register, setValue } = useFormContext()

  const isHealthInsured = answers?.accidentDetails?.isHealthInsured

  const [dateOfAccident, setDateOfAccident] = useState<string | undefined>(
    answers?.accidentDetails?.dateOfAccident,
  )

  const getIsHealthInsured = useLazyIsHealthInsured()

  const getIsHealhInsuredCallback = useCallback(
    async ({ date }: IsHealthInsuredInput) => {
      const { data } = await getIsHealthInsured({
        input: {
          date,
        },
      })

      return data
    },
    [getIsHealthInsured],
  )

  useEffect(() => {
    if (dateOfAccident !== undefined) {
      getIsHealhInsuredCallback({ date: dateOfAccident })
        .then((res) => {
          setValue(
            'accidentDetails.isHealthInsured',
            res?.healthInsuranceIsHealthInsured ? YES : NO,
          )
        })
        .catch((err) => {
          console.log(
            'An error occured fetching health insurance status: ',
            err,
          )
        })
    }
  }, [dateOfAccident, getIsHealhInsuredCallback, setValue])

  const handleDateChange = (date: string) => {
    setDateOfAccident(date)
  }

  return (
    <Box paddingTop={2}>
      <DatePickerController
        label={accidentDetails.labels.date.defaultMessage}
        placeholder={accidentDetails.placeholder.date.defaultMessage}
        id={id}
        backgroundColor="blue"
        onChange={handleDateChange}
      />

      <Box hidden>
        <Controller
          name="reason"
          defaultValue={application.answers.residenceChangeReason}
          render={({ onChange }) => {
            return (
              <Input
                id="accidentDetails.isHealthInsured"
                name="accidentDetails.isHealthInsured"
                defaultValue={'yes'}
                value={isHealthInsured}
                onChange={(e) => {
                  onChange(e.target.value)
                  setValue('accidentDetails.isHealthInsured', e.target.value)
                }}
                ref={register}
              />
            )
          }}
        />
      </Box>
    </Box>
  )
}

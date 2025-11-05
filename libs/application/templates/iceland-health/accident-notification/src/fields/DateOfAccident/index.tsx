import { IsHealthInsuredInput } from '@island.is/api/schema'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { DatePickerController } from '@island.is/shared/form-fields'
import { useCallback, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useLazyIsHealthInsured } from '../../hooks/useLazyIsHealthInsured'
import { AccidentNotification } from '../../lib/dataSchema'
import { accidentDetails } from '../../lib/messages'
import { NO, YES } from '@island.is/application/core'

export const DateOfAccident = ({
  application,
  field,
  error,
}: FieldBaseProps) => {
  const { id } = field
  const answers = application.answers as AccidentNotification
  const { register, setValue } = useFormContext()
  const { lang, formatMessage } = useLocale()

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
        label={formatMessage(accidentDetails.labels.date)}
        placeholder={formatMessage(accidentDetails.placeholder.date)}
        id={id}
        locale={lang}
        defaultValue={dateOfAccident}
        backgroundColor="blue"
        onChange={handleDateChange}
        maxDate={new Date()}
        minDate={new Date(1970, 0)}
        error={error}
        required
      />

      <Box hidden>
        <Controller
          name="reason"
          defaultValue={application.answers.residenceChangeReason}
          render={({ field: { onChange } }) => {
            return (
              <Input
                {...register('accidentDetails.isHealthInsured', {
                  onChange: (e) => {
                    onChange(e.target.value)
                    setValue('accidentDetails.isHealthInsured', e.target.value)
                  },
                })}
                defaultValue={'yes'}
                value={isHealthInsured}
              />
            )
          }}
        />
      </Box>
    </Box>
  )
}

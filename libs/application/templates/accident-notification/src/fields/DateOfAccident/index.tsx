import { IsHealthInsuredInput } from '@island.is/api/schema'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box, DatePicker } from '@island.is/island-ui/core'
import React, { useState, FC, useEffect, useCallback } from 'react'
import { useLazyIsHealthInsured } from '../../hooks/useLazyIsHealthInsured'
import { NO, YES } from '../../constants'
import { accidentDetails } from '../../lib/messages'
import { AccidentNotification } from '../../lib/dataSchema'

type BoolAnswer = typeof YES | typeof NO | undefined

export const DateOfAccident: FC<FieldBaseProps> = ({
  application,
}: FieldBaseProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const answers = application.answers as AccidentNotification

  const currentIsHealth = answers.accidentDetails?.isHealthInsured
  const currentSelectedDate = answers.accidentDetails?.dateOfAccident

  const [stateFulIsHealthInsured, setIsHealthInsured] = useState<
    BoolAnswer | undefined
  >(currentIsHealth)
  console.log('currentIsHealth', stateFulIsHealthInsured)
  const [dateOfAccident, setDateOfAccident] = useState<string | undefined>(
    currentSelectedDate,
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
    console.log('useEffect')
    if (dateOfAccident !== undefined) {
      setIsLoading(true)
      getIsHealhInsuredCallback({ date: dateOfAccident })
        .then((res) => {
          console.log(res)
          setIsLoading(false)
          setIsHealthInsured(res?.healthInsuranceIsHealthInsured ? YES : NO)
        })
        .catch((err) => {
          console.log(
            'An error occured fetching health insurance status: ',
            err,
          )
          setIsLoading(false)
        })
    }
  }, [application.answers, dateOfAccident, getIsHealhInsuredCallback])

  const handleDateChange = (date: Date) => {
    setDateOfAccident(date.toString())
  }

  return (
    <div>
      <Box paddingTop={2}>
        <DatePicker
          label="Date of accident"
          id="accidentDetails.dateOfAccident"
          placeholderText={accidentDetails.placeholder.date.defaultMessage}
          required={true}
          backgroundColor="blue"
          handleChange={handleDateChange}
        />
      </Box>
    </div>
  )
}

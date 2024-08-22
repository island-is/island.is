import { Box, Button, Table as T } from '@island.is/island-ui/core'
import { FormatMessage, useLocale } from '@island.is/localization'
import {
  ExpandHeader,
  ExpandRow,
  NestedFullTable,
} from '@island.is/service-portal/core'
import { formatDate } from '@island.is/service-portal/core'
import { InputController } from '@island.is/shared/form-fields'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { m as coreMessages } from '@island.is/service-portal/core'
import { MessageDescriptor } from 'react-intl'

type FormProps = Record<string, string>

interface SubmitProps {
  permNo: string
  odometerStatus: number
}

type Props = {
  onRowSubmit: (data: SubmitProps) => Promise<boolean>
  vehicles: Array<{
    permNo: string
    title: string
    lastRegistrationDate?: Date
    registrationHistory?: Array<{
      date: string
      origin: string
      mileage: string
    }>
  }>
}

const VehicleBulkMileageTable = ({ vehicles, onRowSubmit }: Props) => {
  const { handleSubmit, control } = useForm<FormProps>({})
  const { formatMessage } = useLocale()

  const onSubmit = (data: FormProps) => {
    const readings: Array<SubmitProps> = (
      Object.entries(data).map((reading) => ({
        permNo: reading[0],
        odometerStatus: parseInt(reading[1]),
      })) ?? []
    ).filter((reading) => !!reading.odometerStatus)

    readings.forEach(async (reading) => {
      onSubmitSingle(reading)
    })
  }
  const onSubmitSingle = async (data: SubmitProps) => {
    const success = await onRowSubmit(data)
    let submissionStatus: 'success' | 'failure'
    if (success) {
      console.log('reading post success')
      submissionStatus = 'success'
    } else {
      console.log('reading post failed')
      submissionStatus = 'failure'
    }

    const indexOfSubmission = submissionState.findIndex(
      (s) => s.permNo === data.permNo,
    )

    const updatedState = [...submissionState]
    updatedState[indexOfSubmission] = {
      ...updatedState[indexOfSubmission],
      submissionStatus,
    }
    setSubmissionState(updatedState)
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <T.Table>
          <ExpandHeader
            data={[
              { value: '', printHidden: true },
              { value: 'Tegund' },
              { value: 'Fastanúmer' },
              { value: 'Síðast skráð' },
              { value: 'Kílómetrastaða' },
              { value: '', printHidden: true },
            ]}
          />
          <T.Body>
            {vehicles.map((vehicle, index) => (

            ))}
          </T.Body>
        </T.Table>
      </Box>
      <Button type="button" onClick={handleSubmit((data) => onSubmit(data))}>
        Vista sýnilegar færslur
      </Button>
    </form>
  )
}

export default VehicleBulkMileageTable

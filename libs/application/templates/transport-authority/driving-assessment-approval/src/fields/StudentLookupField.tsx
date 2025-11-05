import React from 'react'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import * as nationalId from 'kennitala'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import { gql, useLazyQuery } from '@apollo/client'
import { StudentInformationResult } from '@island.is/api/schema'

export const QUERY = gql`
  query studentInfo($nationalId: String!) {
    drivingLicenseStudentInformation(nationalId: $nationalId) {
      student {
        name
      }
    }
  }
`

type LookupProps = {
  field: {
    id: string
  }
  error?: Record<string, string>
}

export const StudentLookupField: FC<React.PropsWithChildren<LookupProps>> = ({
  field,
  error,
}) => {
  const { formatMessage } = useLocale()
  const { id } = field
  const { setValue, watch, clearErrors } = useFormContext()

  const personNationalId: string = watch(`${id}.nationalId`)
  const personName: string = watch(`${id}.name`)

  const [getStudent, { loading: queryLoading }] = useLazyQuery<{
    drivingLicenseStudentInformation: StudentInformationResult
  }>(QUERY, {
    onCompleted: (data) => {
      setValue(
        `${id}.name`,
        data.drivingLicenseStudentInformation?.student?.name ?? '',
      )
      clearErrors(`${id}.name`)
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (personNationalId?.length === 10) {
      const isValidSSN = nationalId.isPerson(personNationalId)
      if (isValidSSN) {
        getStudent({
          variables: {
            nationalId: personNationalId,
          },
        })
      }
    } else if (personNationalId?.length === 0) {
      clearErrors(`${id}.name`)
      clearErrors(`${id}.nationalId`)
      setValue(`${id}.name`, '')
    }
  }, [personName, personNationalId, getStudent, setValue, clearErrors, id])

  return (
    <GridRow>
      <GridColumn span="6/12">
        <InputController
          id={`${id}.nationalId`}
          name={`${id}.nationalId`}
          label={formatMessage(m.nationalId)}
          format="######-####"
          backgroundColor="blue"
          loading={queryLoading}
          error={error ? error?.name : undefined}
        />
      </GridColumn>
      <GridColumn span="6/12">
        <InputController
          id={`${id}.name`}
          name={`${id}.name`}
          label={formatMessage(m.personName)}
          readOnly
        />
      </GridColumn>
    </GridRow>
  )
}

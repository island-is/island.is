import React, { FC, useEffect, useState } from 'react'
import { Box, GridRow, GridColumn, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { gql, useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import * as kennitala from 'kennitala'
import { Student } from '../../types'

const IdentityQuery = gql`
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
    }
  }
`

const NationalIdWithName: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  field,
  application,
}) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const {
    setValue,
    formState: { errors },
  } = useFormContext()
  const [nationalIdInput, setNationalIdInput] = useState('')
  const nameField = `${id}.name`
  const nationaIdField = `${id}.nationalId`
  const nameFieldErrors = getErrorViaPath(errors, nameField)
  const nationalIdFieldErrors = getErrorViaPath(errors, nationaIdField)

  const [getIdentity, { data, loading: queryLoading, error: queryError }] =
    useLazyQuery<Query, { input: IdentityInput }>(IdentityQuery, {
      onCompleted: (data) => {
        if (data.identity?.name) {
          setValue(nameField, data.identity?.name)
        }
      },
    })

  useEffect(() => {
    if (nationalIdInput.length === 10 && kennitala.isValid(nationalIdInput)) {
      getIdentity({
        variables: {
          input: {
            nationalId: nationalIdInput,
          },
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nationalIdInput])

  return (
    <Box>
      <Text marginBottom={3}>
        {`${formatMessage(m.studentInfoSubtitle)} ${getValueViaPath(
          application.externalData,
          'drivingSchoolForEmployee.data.name',
        )}.`}
      </Text>
      <GridRow>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={nationaIdField}
            label="Kennitala"
            defaultValue={
              (application.answers[id] as Student)?.nationalId ?? ''
            }
            format="######-####"
            required
            backgroundColor="blue"
            onChange={(v) =>
              setNationalIdInput(v.target.value.replace(/\W/g, ''))
            }
            loading={queryLoading}
            error={nationalIdFieldErrors}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={nameField}
            defaultValue={(application.answers[id] as Student)?.name ?? ''}
            label="Nafn"
            error={
              queryError || data?.identity === null
                ? formatMessage(m.noStudentFoundForGivenNationalIdMessage)
                : nameFieldErrors && !data
                ? nameFieldErrors
                : undefined
            }
            readOnly
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default NationalIdWithName

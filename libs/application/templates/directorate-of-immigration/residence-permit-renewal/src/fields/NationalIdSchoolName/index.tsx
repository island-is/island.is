import { FC, useEffect, useState } from 'react'
import { Box, GridRow, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps, GenericFormField } from '@island.is/application/types'
import { gql, useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import * as kennitala from 'kennitala'
import { personal } from '../../lib/messages'
import debounce from 'lodash/debounce'
import { IDENTITY_QUERY } from '../../graphql/queries'
import { ApplicantSchool } from '../../shared'
import { getErrorViaPath } from '@island.is/application/core'

interface Props {
  customId?: string
  // onNameChange?: (s: string) => void
  disabled?: boolean
  readOnly?: boolean
  isRequired?: boolean
  addSchoolToApplication: (ssn: string, name: string) => void
}

export const NationalIdSchoolName: FC<Props & FieldBaseProps> = ({
  customId = '',
  field,
  application,
  // onNameChange,
  readOnly,
  disabled,
  isRequired,
  addSchoolToApplication,
  ...props
}) => {
  const { id } = field
  const { errors } = props

  const usedId = customId.length > 0 ? customId : id
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const [nationalIdInput, setNationalIdInput] = useState('')
  const [currentName, setCurrentName] = useState('')

  const schoolNameField = `${usedId}.schoolName`
  const nationaIdField = `${usedId}.nationalId`

  const [getIdentity, { data, loading: queryLoading, error: queryError }] =
    useLazyQuery<Query, { input: IdentityInput }>(
      gql`
        ${IDENTITY_QUERY}
      `,
      {
        onCompleted: (data) => {
          console.log('2')
          console.log('data', data)
          setValue(schoolNameField, data.identity?.givenName ?? undefined)
          setCurrentName(
            `${data.identity?.givenName} ${data.identity?.familyName}`,
          )
        },
      },
    )

  useEffect(() => {
    console.log('1')
    if (nationalIdInput.length === 10 && kennitala.isValid(nationalIdInput)) {
      getIdentity({
        variables: {
          input: {
            nationalId: nationalIdInput,
          },
        },
      })
    }
  }, [nationalIdInput, getIdentity])

  useEffect(() => {
    if (currentName !== '') {
      addSchoolToApplication(nationalIdInput, currentName)
    }
  }, [currentName])

  return (
    <Box>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={nationaIdField}
            label={formatMessage(personal.labels.userInformation.nationalId)}
            format="######-####"
            required={isRequired}
            backgroundColor="blue"
            onChange={debounce((v) => {
              setNationalIdInput(v.target.value.replace(/\W/g, ''))
            })}
            readOnly={readOnly}
            loading={queryLoading}
            error={errors && getErrorViaPath(errors, nationaIdField)}
            disabled={disabled}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={schoolNameField}
            label={formatMessage(personal.labels.userInformation.name)}
            disabled
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}

import { FC, useEffect, useState } from 'react'
import { Box, GridRow, GridColumn, Input } from '@island.is/island-ui/core'
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
import { ParentsToApplicant } from '../../shared'
import { getErrorViaPath } from '@island.is/application/core'

interface Props {
  customId?: string
  disabled?: boolean
  readOnly?: boolean
  isRequired?: boolean
  addParentToApplication: (index: number) => void
  itemNumber: number
  repeaterField: GenericFormField<ParentsToApplicant>
}

export const NationalIdWithGivenFamilyName: FC<Props & FieldBaseProps> = ({
  customId = '',
  field,
  application,
  itemNumber,
  readOnly,
  disabled,
  repeaterField,
  isRequired,
  addParentToApplication,
  ...props
}) => {
  const { id } = field
  const { errors } = props

  const usedId = customId.length > 0 ? customId : id
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const [nationalIdInput, setNationalIdInput] = useState('')
  const [fullName, setFullName] = useState('')

  const fullNameField = `${usedId}.fullName`
  const nationalIdField = `${usedId}.nationalId`
  const wasRemovedField = `${usedId}.wasRemoved`

  const [getIdentity, { loading: queryLoading }] = useLazyQuery<
    Query,
    { input: IdentityInput }
  >(
    gql`
      ${IDENTITY_QUERY}
    `,
    {
      onCompleted: (data) => {
        const fullName = data.identity?.name ?? ''
        setFullName(fullName)
        setValue(fullNameField, fullName)
      },
    },
  )

  useEffect(() => {
    setValue(wasRemovedField, repeaterField.wasRemoved)
  }, [repeaterField.wasRemoved])

  useEffect(() => {
    if (repeaterField.nationalId) {
      setNationalIdInput(repeaterField.nationalId)
      setValue(nationalIdField, repeaterField.nationalId)
    }
  }, [repeaterField.nationalId])

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

    if (nationalIdInput === '' && !isRequired) {
      setValue(wasRemovedField, 'true')
      setFullName('')
      setValue(fullNameField, '')
      setNationalIdInput('')
      setValue(nationalIdField, '')
    } else {
      setValue(wasRemovedField, 'false')
    }
  }, [nationalIdInput])

  useEffect(() => {
    if (fullName !== '') {
      addParentToApplication(itemNumber)
    }
  }, [fullName, itemNumber])

  return (
    <Box>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={nationalIdField}
            label={formatMessage(personal.labels.userInformation.nationalId)}
            format="######-####"
            required={isRequired}
            backgroundColor="blue"
            onChange={debounce((v) => {
              setNationalIdInput(v.target.value.replace(/\W/g, ''))
            })}
            readOnly={readOnly}
            loading={queryLoading}
            error={errors && getErrorViaPath(errors, nationalIdField)}
            disabled={disabled}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <Input
            name={fullNameField}
            value={fullName}
            label={formatMessage(personal.labels.userInformation.name)}
            disabled
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}

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
import { ParentsToApplicant } from '../../shared'
import { getErrorViaPath } from '@island.is/application/core'

interface Props {
  customId?: string
  // onNameChange?: (s: string) => void
  disabled?: boolean
  readOnly?: boolean
  isRequired?: boolean
  addParentToApplication: (index: number) => void
  itemNumber: number
  repeaterField: GenericFormField<ParentsToApplicant>
}

export const NationalIdWithName: FC<Props & FieldBaseProps> = ({
  customId = '',
  field,
  application,
  // onNameChange,
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
  const [currentName, setCurrentName] = useState('')

  const nameField = `${usedId}.name`
  const nationaIdField = `${usedId}.nationalId`
  const wasRemovedField = `${usedId}.wasRemoved`

  const [
    getIdentity,
    { data, loading: queryLoading, error: queryError },
  ] = useLazyQuery<Query, { input: IdentityInput }>(
    gql`
      ${IDENTITY_QUERY}
    `,
    {
      onCompleted: (data) => {
        setValue(nameField, data.identity?.name ?? undefined)
        setCurrentName(data.identity?.name ?? '')
      },
    },
  )

  useEffect(() => {
    setValue(wasRemovedField, repeaterField.wasRemoved)
  }, [repeaterField.wasRemoved, setValue])

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
  }, [nationalIdInput, getIdentity])

  useEffect(() => {
    if (currentName !== '') {
      addParentToApplication(itemNumber)
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
            id={nameField}
            label={formatMessage(personal.labels.userInformation.name)}
            disabled
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}

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
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'

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
  const [currentName, setCurrentName] = useState('')

  const givenNameField = `${usedId}.givenName`
  const familyNameField = `${usedId}.familyName`
  const currentNameField = `${usedId}.currentName`
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
        setValue(givenNameField, data.identity?.givenName ?? undefined)
        setValue(familyNameField, data.identity?.familyName ?? undefined)
        const currentName = data.identity?.name ?? ''
        setCurrentName(currentName)
        setValue(currentNameField, currentName)
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

    const givenName = getValueViaPath(
      application.answers,
      givenNameField,
      '',
    ) as string

    const familyName = getValueViaPath(
      application.answers,
      familyNameField,
      '',
    ) as string

    if (!!givenName && !!familyName) {
      setCurrentName(`${givenName} ${familyName}`)
    }

    if (nationalIdInput === '' && !isRequired) {
      setValue(wasRemovedField, 'true')
      setCurrentName('')
      setValue(currentNameField, '')
    } else {
      setValue(wasRemovedField, 'false')
    }
  }, [nationalIdInput])

  useEffect(() => {
    if (currentName !== '') {
      addParentToApplication(itemNumber)
    }
  }, [currentName, itemNumber])

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
            name={currentNameField}
            value={currentName}
            label={formatMessage(personal.labels.userInformation.name)}
            disabled
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}

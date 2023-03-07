import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useEffect } from 'react'
import { useLocale } from '@island.is/localization'
import {
  CheckboxController,
  DatePickerController,
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  Text,
  AlertMessage,
} from '@island.is/island-ui/core'
import * as styles from '../styles.css'
import { useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import * as kennitala from 'kennitala'
import { m } from '../../lib/messages'
import { YES } from '../../lib/constants'
import { IDENTITY_QUERY } from '../../graphql'
import { hasYes } from '@island.is/application/core'
import { TextFormField } from '@island.is/application/ui-fields'
import {
  Application,
  FieldComponents,
  FieldTypes,
  GenericFormField,
} from '@island.is/application/types'
import { EstateMember } from '../../types'
import { useState } from '@storybook/addons'

export const AdditionalEstateMember = ({
  application,
  field,
  index,
  remove,
  fieldName,
  relationOptions,
  error,
}: {
  application: Application
  field: GenericFormField<EstateMember>
  index: number
  remove: (index?: number | number[] | undefined) => void
  fieldName: string
  relationOptions: { value: string; label: string }[]
  error: Record<string, string>
}) => {
  const { formatMessage } = useLocale()
  const fieldIndex = `${fieldName}[${index}]`
  const nameField = `${fieldIndex}.name`
  const nationalIdField = `${fieldIndex}.nationalId`
  const relationField = `${fieldIndex}.relation`
  const dateOfBirthField = `${fieldIndex}.dateOfBirth`
  const foreignCitizenshipField = `${fieldIndex}.foreignCitizenship`
  const initialField = `${fieldIndex}.initial`
  const dummyField = `${fieldIndex}.dummy`
  const enabledField = `${fieldIndex}.enabled`
  const nationalIdInput = useWatch({ name: nationalIdField, defaultValue: '' })
  const name = useWatch({ name: nameField, defaultValue: '' })
  const foreignCitizenship = useWatch({
    name: foreignCitizenshipField,
    defaultValue: hasYes(field.foreignCitizenship) ? [YES] : '',
  })

  // If hair is under 18, we need to ask for advocate
  const [heirUnder18, setHeirUnder18] = useState(false)
  const advocateNameField = `${fieldIndex}.advocateName`
  const advocateNationalIdField = `${fieldIndex}.advocateNationalId`
  const advocateNationalIdInput = useWatch({
    name: advocateNationalIdField,
    defaultValue: '',
  })
  const advocateName = useWatch({ name: advocateNameField, defaultValue: '' })

  const { control, setValue } = useFormContext()

  const [
    getIdentity,
    { loading: queryLoading, error: queryError },
  ] = useLazyQuery<Query, { input: IdentityInput }>(IDENTITY_QUERY, {
    onCompleted: (data) => {
      setValue(nameField, data.identity?.name ?? '')
    },
    fetchPolicy: 'network-only',
  })
  const [
    getAdvocateIdentity,
    { loading: advocateQueryLoading, error: advocateQueryError },
  ] = useLazyQuery<Query, { input: IdentityInput }>(IDENTITY_QUERY, {
    onCompleted: (data) => {
      setValue(advocateNameField, data.identity?.name ?? '')
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (nationalIdInput.length === 10 && kennitala.isValid(nationalIdInput)) {
      setHeirUnder18(kennitala.info(nationalIdInput).age < 18)
      getIdentity({
        variables: {
          input: {
            nationalId: nationalIdInput,
          },
        },
      })
    } else if (
      name !== '' &&
      (!foreignCitizenship || foreignCitizenship.length === 0)
    ) {
      setValue(nameField, '')
    }
  }, [
    getIdentity,
    name,
    nameField,
    nationalIdInput,
    setValue,
    foreignCitizenship,
  ])

  // Advocate
  useEffect(() => {
    if (advocateNationalIdInput.length === 10) {
      console.log(advocateNationalIdInput, 'hæ')
      getAdvocateIdentity({
        variables: {
          input: {
            nationalId: advocateNationalIdInput,
          },
        },
      })
    }
  }, [
    getAdvocateIdentity,
    advocateName,
    advocateNameField,
    advocateNationalIdInput,
    setValue,
  ])

  return (
    <Box position="relative" key={field.id} marginTop={2}>
      <Controller
        name={initialField}
        control={control}
        defaultValue={field.initial || false}
        render={() => <input type="hidden" />}
      />
      <Controller
        name={dummyField}
        control={control}
        defaultValue={field.dummy || false}
        render={() => <input type="hidden" />}
      />
      <Controller
        name={enabledField}
        control={control}
        defaultValue={field.enabled || false}
        render={() => <input type="hidden" />}
      />
      <Text variant="h4">
        {formatMessage(m.estateMember) + ' ' + (index + 1)}
      </Text>
      <Box position="absolute" className={styles.removeFieldButton}>
        <Button
          variant="ghost"
          size="small"
          circle
          icon="remove"
          onClick={() => {
            remove(index)
          }}
        />
      </Box>
      <GridRow>
        {foreignCitizenship[0] !== YES ? (
          <>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2} paddingTop={2}>
              <InputController
                key={nationalIdField}
                id={nationalIdField}
                name={nationalIdField}
                label={formatMessage(m.inheritanceKtLabel)}
                defaultValue={field.nationalId || ''}
                format="######-####"
                required
                backgroundColor="blue"
                loading={queryLoading}
                error={queryError ? formatMessage('error') : undefined}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <TextFormField
                application={application}
                error={error?.name ?? undefined}
                showFieldName={true}
                field={{
                  ...field,
                  id: nameField,
                  title: formatMessage(m.inheritanceNameLabel),
                  placeholder: '',
                  defaultValue: field.name || '',
                  type: FieldTypes.TEXT,
                  component: FieldComponents.TEXT,
                  children: undefined,
                  backgroundColor: 'blue',
                  readOnly: true,
                }}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <SelectController
                key={relationField}
                id={relationField}
                name={relationField}
                label={formatMessage(m.inheritanceRelationLabel)}
                defaultValue={field.relation}
                options={relationOptions}
                backgroundColor="blue"
                error={error?.relation ?? undefined}
              />
            </GridColumn>
          </>
        ) : (
          <>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                key={nameField}
                id={nameField}
                name={nameField}
                backgroundColor="blue"
                defaultValue={field.name}
                error={error?.name ?? undefined}
                label={formatMessage(m.inheritanceNameLabel)}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <DatePickerController
                label={formatMessage(m.inheritanceDayOfBirthLabel)}
                placeholder={formatMessage(m.inheritanceDayOfBirthLabel)}
                id={dateOfBirthField}
                key={dateOfBirthField}
                name={dateOfBirthField}
                locale="is"
                maxDate={new Date()}
                backgroundColor="white"
                onChange={(d) => {
                  setValue(dateOfBirthField, d)
                }}
                error={error?.dateOfBirth ?? undefined}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <SelectController
                key={relationField}
                id={relationField}
                name={relationField}
                label={formatMessage(m.inheritanceRelationLabel)}
                defaultValue={field.relation}
                options={relationOptions}
                error={error?.relation ?? undefined}
                backgroundColor="blue"
              />
            </GridColumn>
          </>
        )}
        <GridColumn span="1/1" paddingBottom={2}>
          <CheckboxController
            key={foreignCitizenshipField}
            id={foreignCitizenshipField}
            name={foreignCitizenshipField}
            defaultValue={field?.foreignCitizenship || []}
            options={[
              {
                label: formatMessage(m.inheritanceForeignCitizenshipLabel),
                value: YES,
              },
            ]}
          />
        </GridColumn>
        {heirUnder18 && (
          <>
            <GridColumn span="1/1" paddingBottom={2}>
              <AlertMessage
                title={formatMessage(m.estateMemberAdvocateWarningTitle)}
                message={formatMessage(
                  m.estateMemberAdvocateWarningDescription,
                )}
                type="warning"
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2} paddingTop={2}>
              <InputController
                key={advocateNationalIdField}
                id={advocateNationalIdField}
                name={advocateNationalIdField}
                label={formatMessage(m.inheritanceKtLabel)}
                defaultValue={(field as any).advocateNationalId || ''}
                format="######-####"
                required
                backgroundColor="blue"
                loading={advocateQueryLoading}
                error={advocateQueryError ? formatMessage('error') : undefined}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <TextFormField
                application={application}
                error={error?.name ?? undefined}
                showFieldName={true}
                field={{
                  ...field,
                  id: advocateNameField,
                  title: formatMessage(m.inheritanceNameLabel),
                  defaultValue: (field as any).advocateName || '',
                  type: FieldTypes.TEXT,
                  component: FieldComponents.TEXT,
                  children: undefined,
                  readOnly: true,
                }}
              />
            </GridColumn>
          </>
        )}
      </GridRow>
    </Box>
  )
}

export default AdditionalEstateMember

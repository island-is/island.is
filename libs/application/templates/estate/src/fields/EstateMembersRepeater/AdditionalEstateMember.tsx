import { useEffect } from 'react'
import {
  ArrayField,
  Controller,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import {
  CheckboxController,
  DatePickerController,
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { Box, GridColumn, GridRow, Button } from '@island.is/island-ui/core'
import * as styles from '../styles.css'
import { useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import * as kennitala from 'kennitala'
import { m } from '../../lib/messages'
import { YES } from '../../lib/constants'
import { IDENTITY_QUERY } from '../../graphql'
import { hasYes } from '../../lib/utils'

export const AdditionalEstateMember = ({
  field,
  index,
  remove,
  fieldName,
  relationOptions,
  error,
}: {
  field: Partial<ArrayField<any, 'id'>>
  index: number
  remove: (index?: number | number[] | undefined) => void
  fieldName: string
  relationOptions: { value: string; label: string }[]
  error: any
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

  useEffect(() => {
    if (nationalIdInput.length === 10 && kennitala.isValid(nationalIdInput)) {
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
  }, [getIdentity, name, nameField, nationalIdInput, setValue])

  return (
    <Box position="relative" key={field.id} marginTop={2}>
      <Controller
        name={initialField}
        control={control}
        defaultValue={field.initial || false}
      />
      <Controller
        name={dummyField}
        control={control}
        defaultValue={field.dummy || false}
      />
      <Controller
        name={enabledField}
        control={control}
        defaultValue={field.enabled || false}
      />
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
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                key={nationalIdField}
                id={nationalIdField}
                name={nationalIdField}
                label={formatMessage(m.inheritanceKtLabel)}
                defaultValue={field.nationalId}
                format="######-####"
                required
                backgroundColor="blue"
                loading={queryLoading}
                error={queryError ? formatMessage('error') : undefined}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                key={nameField}
                id={nameField}
                name={nameField}
                defaultValue={field.name}
                label={formatMessage(m.inheritanceNameLabel)}
                error={error?.name ?? undefined}
                readOnly
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
      </GridRow>
    </Box>
  )
}

export default AdditionalEstateMember

import React, { FC, useEffect } from 'react'
import {
  ArrayField,
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import {
  CheckboxController,
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/core'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  ProfileCard,
} from '@island.is/island-ui/core'
import { Answers, EstateMember } from '../../types'
import { format as formatNationalId } from 'kennitala'
import * as styles from './EstateMemberRepeater.css'
import { useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import { IDENTITY_QUERY } from '../../graphql/'
import * as kennitala from 'kennitala'
import { m } from '../../lib/messages'

export const EstateMemberRepeater: FC<FieldBaseProps<Answers>> = ({
  application,
  field,
}) => {
  const relations =
    (application.externalData.syslumennOnEntry?.data as {
      relationOptions: string[]
    }).relationOptions.map((relation) => ({
      value: relation,
      label: relation,
    })) || []
  const { id } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove } = useFieldArray<EstateMember>({
    name: id,
  })
  const handleAddMember = () =>
    append({
      nationalId: '',
      initial: false,
      name: '',
    })

  return (
    <Box marginTop={2}>
      <GridRow>
        {fields.reduce((acc, member, index) => {
          if (!member.initial) {
            return acc
          }
          return [
            ...acc,
            <GridColumn
              key={index}
              span={['12/12', '12/12', '6/12']}
              paddingBottom={3}
            >
              <ProfileCard
                title={member.name}
                description={[
                  formatNationalId(member.nationalId || ''),
                  member.relation || '',
                  <Box marginTop={1} as="span">
                    <Button
                      variant="text"
                      icon="trash"
                      size="small"
                      iconType="outline"
                      onClick={() => remove(index)}
                    >
                      {formatMessage(m.inheritanceRemoveMember)}
                    </Button>
                  </Box>,
                ]}
              />
            </GridColumn>,
          ]
        }, [] as JSX.Element[])}
      </GridRow>
      {fields.map((member, index) => (
        <Box key={member.id} hidden={member.initial}>
          <Item
            field={member}
            fieldName={id}
            index={index}
            relationOptions={relations}
            remove={remove}
          />
        </Box>
      ))}
      <Box marginTop={1}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddMember}
          size="small"
        >
          {formatMessage(m.inheritanceAddMember)}
        </Button>
      </Box>
    </Box>
  )
}

const Item = ({
  field,
  index,
  remove,
  fieldName,
  relationOptions,
}: {
  field: Partial<ArrayField<EstateMember, 'id'>>
  index: number
  remove: (index?: number | number[] | undefined) => void
  fieldName: string
  relationOptions: { value: string; label: string }[]
}) => {
  const { formatMessage } = useLocale()
  const fieldIndex = `${fieldName}[${index}]`
  const nameField = `${fieldIndex}.name`
  const nationalIdField = `${fieldIndex}.nationalId`
  const relationField = `${fieldIndex}.relation`
  const custodianField = `${fieldIndex}.custodian`
  const dateOfBirthField = `${fieldIndex}.dateOfBirth`
  const foreignCitizenshipField = `${fieldIndex}.foreignCitizenship`
  const initialField = `${fieldIndex}.initial`
  const nationalIdInput = useWatch({ name: nationalIdField, defaultValue: '' })
  const name = useWatch({ name: nameField, defaultValue: '' })
  const foreignCitizenship = useWatch({
    name: foreignCitizenshipField,
    defaultValue: '',
  })

  const { control, setValue } = useFormContext()

  const [
    getIdentity,
    { loading: queryLoading, error: queryError },
  ] = useLazyQuery<Query, { input: IdentityInput }>(IDENTITY_QUERY, {
    onError: (error: unknown) => {
      console.log('getIdentity error:', error)
    },
    onCompleted: (data) => {
      setValue(nameField, data.identity?.name ?? '')
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
    } else if (name !== '') {
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
        {foreignCitizenship[0] !== 'yes' ? (
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
                error={
                  queryError
                    ? formatMessage(m.errorNationalIdIncorrect)
                    : undefined
                }
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
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                key={nameField}
                id={nameField}
                name={nameField}
                defaultValue={field.name}
                label={formatMessage(m.inheritanceNameLabel)}
                readOnly
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                key={custodianField}
                id={custodianField}
                name={custodianField}
                defaultValue={field.custodian}
                label={formatMessage(m.inheritanceCustodyLabel)}
                readOnly
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
                label={formatMessage(m.inheritanceNameLabel)}
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
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                key={dateOfBirthField}
                id={dateOfBirthField}
                name={dateOfBirthField}
                backgroundColor="blue"
                defaultValue={field.dateOfBirth}
                label={formatMessage(m.inheritanceDayOfBirthLabel)}
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
                value: 'yes',
              },
            ]}
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}

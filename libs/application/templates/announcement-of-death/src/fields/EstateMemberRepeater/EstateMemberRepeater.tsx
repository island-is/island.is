import React, { FC, useEffect } from 'react'
import {
  ArrayField,
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
import { Answers, EstateMember, RelationEnum } from '../../types'

import * as styles from './EstateMemberRepeater.css'
import { gql, useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import * as kennitala from 'kennitala'
import { m } from '../../lib/messages'

const IdentityQuery = gql`
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
    }
  }
`
export const EstateMemberRepeater: FC<FieldBaseProps<Answers>> = ({
  field,
  application,
}) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove } = useFieldArray<EstateMember>({
    name: id,
  })
  const handleAddMember = () =>
    append({
      nationalId: '',
      relation: RelationEnum.PARENT,
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
                  member.nationalId || '',
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
          <Item field={member} fieldName={id} index={index} remove={remove} />
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
}: {
  field: Partial<ArrayField<EstateMember, 'id'>>
  index: number
  remove: (index?: number | number[] | undefined) => void
  fieldName: string
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

  const { register, setValue } = useFormContext()

  const [
    getIdentity,
    { loading: queryLoading, error: queryError },
  ] = useLazyQuery<Query, { input: IdentityInput }>(IdentityQuery, {
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
  useEffect(() => {
    // TODO: This needs to be better implemented, initial value gets removed from all fields when one is removed
    // forcing initial value to be set on all fields - and add hidden field to form to prevent the value from being overwritten
    setValue(initialField, field.initial || false)
  }, [field.initial, setValue, initialField])

  return (
    <Box position="relative" key={field.id} marginTop={2}>
      <input
        type="checkbox"
        hidden={true}
        name={initialField}
        ref={register}
        defaultChecked={field.initial}
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
                options={[
                  // TODO: Get value
                  {
                    value: RelationEnum.CHILD,
                    label: 'Barn',
                  },
                  {
                    value: RelationEnum.PARENT,
                    label: 'Foreldri',
                  },
                  {
                    value: RelationEnum.SIBLING,
                    label: 'Systkini',
                  },
                  {
                    value: RelationEnum.SPOUSE,
                    label: 'Maki',
                  },
                ]}
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
                options={[
                  // TODO: Get value
                  {
                    value: RelationEnum.CHILD,
                    label: 'Barn',
                  },
                  {
                    value: RelationEnum.PARENT,
                    label: 'Foreldri',
                  },
                  {
                    value: RelationEnum.SIBLING,
                    label: 'Systkini',
                  },
                  {
                    value: RelationEnum.SPOUSE,
                    label: 'Maki',
                  },
                ]}
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

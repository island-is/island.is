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
import { EstateMember, RelationEnum } from '../../types'

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
export const EstateMemberRepeater: FC<FieldBaseProps> = ({ field }) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove } = useFieldArray<EstateMember>({ name: id })

  const handleAddMember = () =>
    append({
      nationalId: '',
      relation: RelationEnum.PARENT,
    })

  return (
    <Box marginTop={2}>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={3}>
          <ProfileCard
            // TODO: Get value
            title="Karl Sveinn Markúsarson"
            description={[
              '010142-2569',
              'Maki',
              <Box marginTop={1} as="span">
                <Button
                  variant="text"
                  icon="trash"
                  size="small"
                  iconType="outline"
                >
                  {formatMessage(m.inheritanceRemoveMember)}
                </Button>
              </Box>,
            ]}
          />
        </GridColumn>
      </GridRow>
      {fields.map((estateField, index) => (
        <Item
          key={estateField.id}
          field={estateField}
          index={index}
          remove={remove}
        />
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
}: {
  field: Partial<ArrayField<EstateMember, 'id'>>
  index: number
  remove: (index?: number | number[] | undefined) => void
}) => {
  const { formatMessage } = useLocale()
  const fieldIndex = `${field.id}[${index}]`
  const nameField = `${fieldIndex}.name`
  const nationalIdField = `${fieldIndex}.nationalId`
  const relationField = `${fieldIndex}.relation`
  const custodianField = `${fieldIndex}.custodian`
  const dateOfBirthField = `${fieldIndex}.dateOfBirth`
  const foreignCitizenshipField = `${fieldIndex}.foreignCitizenship`
  const nationalIdInput = useWatch({ name: nationalIdField, defaultValue: '' })
  const name = useWatch({ name: nameField, defaultValue: '' })
  const foreignCitizenship = useWatch({
    name: foreignCitizenshipField,
    defaultValue: '',
  })

  const { setValue } = useFormContext()

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

  return (
    <Box position="relative" key={field.id} marginTop={2}>
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
                id={nameField}
                name={nameField}
                label={formatMessage(m.inheritanceNameLabel)}
                readOnly
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                id={custodianField}
                name={custodianField}
                label={formatMessage(m.inheritanceCustodyLabel)}
                readOnly
              />
            </GridColumn>
          </>
        ) : (
          <>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                id={nameField}
                name={nameField}
                label={formatMessage(m.inheritanceNameLabel)}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <SelectController
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
                id={dateOfBirthField}
                name={dateOfBirthField}
                label={formatMessage(m.inheritanceDayOfBirthLabel)}
              />
            </GridColumn>
          </>
        )}
        <GridColumn span="1/1" paddingBottom={2}>
          <CheckboxController
            id={foreignCitizenshipField}
            name={foreignCitizenshipField}
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

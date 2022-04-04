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
  LoadingDots,
} from '@island.is/island-ui/core'
import { EstateMember, RelationEnum } from '../../types'

import * as styles from './EstateMemberRepeater.css'
import { getRelationOptions } from '../../lib/utils'
import { gql, useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import * as kennitala from 'kennitala'

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
            title="Karl Sveinn Markúsarson"
            description={['010142-2569', 'Maki']}
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
          Bæta við
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
  const fieldIndex = `${field.id}[${index}]`
  const nameField = `${fieldIndex}.name`
  const nationalIdField = `${fieldIndex}.nationalId`
  const relationField = `${fieldIndex}.relation`
  const custodianField = `${fieldIndex}.custodian`
  const foreignCitizenshipField = `${fieldIndex}.foreignCitizenship`
  const nationalIdInput = useWatch({ name: nationalIdField, defaultValue: '' })

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
    }
  }, [nationalIdInput])

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
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={nationalIdField}
            name={nationalIdField}
            label="Kennitala"
            defaultValue={field.nationalId}
            format="######-####"
            required
            backgroundColor="blue"
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <SelectController
            id={relationField}
            name={relationField}
            label="Tengsl"
            defaultValue={field.relation}
            options={[
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
          {queryLoading ? (
            <LoadingDots />
          ) : (
            <InputController
              id={nameField}
              name={nameField}
              label="Nafn"
              error={
                queryError
                  ? 'Villa kom upp við að sækja nafn út frá kennitölu. Vinsamlegast prófið aftur síðar.'
                  : undefined
              }
              readOnly
            />
          )}
        </GridColumn>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={custodianField}
            name={custodianField}
            label="Forsjáraðili"
            readOnly
          />
        </GridColumn>
        <GridColumn span="1/1" paddingBottom={2}>
          <CheckboxController
            id={foreignCitizenshipField}
            name={foreignCitizenshipField}
            options={[
              {
                label: 'Aðili með erlent ríkisfang',
                value: 'yes',
                subLabel: 'bla',
              },
            ]}
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}

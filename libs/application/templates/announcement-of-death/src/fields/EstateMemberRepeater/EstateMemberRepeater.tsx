import React, { FC, useEffect } from 'react'
import { useFieldArray } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import {
  CheckboxController,
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import {
  FieldBaseProps,
  formatText,
  getErrorViaPath,
} from '@island.is/application/core'
import {
  Box,
  Text,
  GridColumn,
  GridRow,
  Button,
  ProfileCard,
} from '@island.is/island-ui/core'
import { EstateMember, RelationEnum } from '../../types'

import * as styles from './EstateMemberRepeater.css'
import { getRelationOptions } from '../../lib/utils'

export const EstateMemberRepeater: FC<FieldBaseProps> = ({
  application,
  errors,
  field,
}) => {
  const { id, title } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove } = useFieldArray<EstateMember>({ name: id })

  console.log('application', application)
  const handleAddMember = () =>
    append({
      nationalId: '1122334455',
      relation: RelationEnum.PARENT,
    })
  const handleRemoveMember = (index: number) => remove(index)

  const relationOptions = getRelationOptions()

  return (
    <Box marginTop={3}>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={3}>
          <ProfileCard
            title="Karl Sveinn Markúsarson"
            description={['010142-2569', 'Maki']}
          />
        </GridColumn>
      </GridRow>
      {fields.map((field, index) => {
        const fieldIndex = `${id}[${index}]`
        const nameField = `${fieldIndex}.name`
        const nationalIdField = `${fieldIndex}.nationalId`
        const relationField = `${fieldIndex}.relation`
        const custodianField = `${fieldIndex}.custodian`
        const foreignCitizenshipField = `${fieldIndex}.foreignCitizenship`

        return (
          <Box position="relative" key={field.id} marginTop={3}>
            <Box position="absolute" className={styles.removeFieldButton}>
              <Button
                variant="ghost"
                size="small"
                circle
                icon="remove"
                onClick={handleRemoveMember.bind(null, index)}
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
                  error={errors && getErrorViaPath(errors, nationalIdField)}
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
                  error={errors && getErrorViaPath(errors, relationField)}
                  backgroundColor="blue"
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={nameField}
                  name={nameField}
                  label="Nafn"
                  disabled
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={custodianField}
                  name={custodianField}
                  label="Forsjáraðili"
                  disabled
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
      })}
      <Box marginTop={3}>
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

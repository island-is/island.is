import React from 'react'
import { useFieldArray } from 'react-hook-form'
import { Box, Button, Text } from '@island.is/island-ui/core'
import {
  CheckboxController,
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { CRCFieldBaseProps } from '../../types'

const MockChildren = ({ application, field }: CRCFieldBaseProps) => {
  const { id } = field
  const { answers } = application
  const parents = answers.mockData?.parents
  const children = answers.mockData?.children
  const { fields, append, remove } = useFieldArray({ name: id })

  const handleAddPerson = () =>
    append({
      name: '',
      nationalId: '',
      otherParent: '',
      livesWithApplicant: '',
    })
  const handleRemovePerson = (index: number) => remove(index)

  return (
    <Box marginTop={4}>
      {fields.map((field, index) => {
        return (
          <Box key={field.id} marginBottom={3}>
            <Box marginBottom={1}>
              <Button
                variant="ghost"
                size="small"
                circle
                icon="remove"
                onClick={handleRemovePerson.bind(null, index)}
              />
            </Box>
            <Text>Barn {index + 1}</Text>
            <Box marginTop={2}>
              <InputController
                id={`${id}[${index}].fullName`}
                name={`${id}[${index}].fullName`}
                defaultValue={
                  children?.[index]?.fullName || `Barn ${index + 1}`
                }
                label="Nafn"
              />
            </Box>
            <Box marginTop={2}>
              <InputController
                id={`${id}[${index}].nationalId`}
                name={`${id}[${index}].nationalId`}
                defaultValue={
                  children?.[index]?.nationalId ||
                  (
                    Math.floor(Math.random() * 9000000000) + 1000000000
                  ).toString()
                }
                label="Kennitala"
              />
            </Box>
            <Box marginTop={2}>
              <SelectController
                label="Foreldri"
                id={`${id}[${index}].otherParent`}
                name={`${id}[${index}].otherParent`}
                defaultValue={parents.length === 1 ? 0 : null}
                options={parents?.map((parent, i) => ({
                  value: i,
                  label: parent.fullName,
                }))}
              />
            </Box>
            <Box marginTop={2}>
              <CheckboxController
                id={`${id}[${index}].livesWithApplicant`}
                name={`${id}[${index}].livesWithApplicant`}
                large={true}
                defaultValue={['yes']}
                options={[
                  {
                    value: 'yes',
                    label: 'Lives with applicant',
                  },
                ]}
              />
            </Box>
            <Box marginTop={2}>
              <CheckboxController
                id={`${id}[${index}].livesWithBothParents`}
                name={`${id}[${index}].livesWithBothParents`}
                large={true}
                options={[
                  {
                    value: 'yes',
                    label: 'Lives with both parents',
                  },
                ]}
              />
            </Box>
            <Box marginTop={2}>
              <CheckboxController
                id={`${id}[${index}].applicantSoleCustody`}
                name={`${id}[${index}].applicantSoleCustody`}
                large={true}
                options={[
                  {
                    value: 'yes',
                    label: 'Applicant has sole custody',
                  },
                ]}
              />
            </Box>
          </Box>
        )
      })}
      <Button
        variant="ghost"
        icon="add"
        iconType="outline"
        onClick={handleAddPerson}
        size="small"
      >
        Bæta við barni
      </Button>
    </Box>
  )
}

export default MockChildren

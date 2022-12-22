import React, { useEffect, useCallback } from 'react'
import { useFieldArray } from 'react-hook-form'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { CRCFieldBaseProps } from '../../types'

const parentBDefaults = {
  name: 'Tester Testers',
  address: 'Bólstaðarhlíð',
  postalCode: '105',
  city: 'Reykjavík',
}

const MockParents = ({ application, field }: CRCFieldBaseProps) => {
  const { id } = field
  const { answers } = application
  const parents = answers.mockData?.parents

  const { fields, append, remove } = useFieldArray({ name: id })

  const handleAddPerson = useCallback(() => {
    append({
      name: '',
      nationalId: '',
      address: {
        streetName: '',
        postalCode: '',
        city: '',
      },
    })
  }, [append])

  const handleRemovePerson = (index: number) => remove(index)

  useEffect(() => {
    // The repeater should include one line by default
    if (fields.length === 0) {
      handleAddPerson()
    }
  }, [fields, handleAddPerson])

  return (
    <Box marginTop={5}>
      {fields.map((field, index) => {
        return (
          <Box key={field.id} marginBottom={3}>
            {index > 0 && (
              <Box marginBottom={1}>
                <Button
                  variant="ghost"
                  size="small"
                  circle
                  icon="remove"
                  onClick={handleRemovePerson.bind(null, index)}
                />
              </Box>
            )}
            <Text>Foreldri B</Text>
            <Box marginTop={2}>
              <InputController
                id={`${id}[${index}].nationalId`}
                name={`${id}[${index}].nationalId`}
                label="Kennitala"
                format="######-####"
              />
            </Box>
            <Box marginTop={2}>
              <InputController
                id={`${id}[${index}].fullName`}
                name={`${id}[${index}].fullName`}
                label="Nafn"
                defaultValue={
                  parents?.[index]?.fullName || parentBDefaults.name
                }
              />
            </Box>
            <Box marginTop={2}>
              <InputController
                id={`${id}[${index}].address.streetAddress`}
                name={`${id}[${index}].address.streetAddress`}
                label="Heimilisfang"
                defaultValue={
                  parents?.[index]?.address?.streetAddress ||
                  parentBDefaults.address
                }
              />
            </Box>
            <Box marginTop={2}>
              <InputController
                id={`${id}[${index}].address.postalCode`}
                name={`${id}[${index}].address.postalCode`}
                label="Póstnúmer"
                defaultValue={
                  parents?.[index]?.address?.postalCode ||
                  parentBDefaults.postalCode
                }
              />
            </Box>
            <Box marginTop={2}>
              <InputController
                id={`${id}[${index}].address.city`}
                name={`${id}[${index}].address.city`}
                label="Borg"
                defaultValue={
                  parents?.[index]?.address?.locality || parentBDefaults.city
                }
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
        Bæta við foreldri
      </Button>
    </Box>
  )
}

export default MockParents

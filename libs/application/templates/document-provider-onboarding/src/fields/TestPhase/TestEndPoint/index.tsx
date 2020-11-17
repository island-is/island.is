import React, { FC, useEffect, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Button, Input, Text } from '@island.is/island-ui/core'
import {
  FieldDescription,
  InputController,
} from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'

const TestEnvironment: FC<FieldBaseProps> = ({ error, field, application }) => {
  interface Variable {
    id: string
    name: string
    value: string
  }

  const { register } = useFormContext()

  const fetchAndValidateData = async () => {
    //This should be POST to create new user, answer will hold variables, is GET for now.
    console.log(this)
    fetch('/api/endPointVariables')
      .then((response) => response.json())
      .then((json) => setendPointVariables(json))
  }

  let [variables, setendPointVariables] = useState<Variable[]>([])

  //TODO: Endpoint cannot be null before we call fetchendpointData...
  return (
    <Box>
      <Box marginBottom={7}>
        <Box marginBottom={3}>
          <FieldDescription description="Til að hægt sé að sækja skjöl til skjalaveitu þarf að tilgreina endapunkt. Þegar endapunktur er vistaður er búnar til Audience og Scope breytur." />
        </Box>
        <Box marginBottom={1}>
          <Input
            label="Endapunktur"
            name={'endPoint'}
            id={'endPoint'}
            ref={register}
            placeholder="Skráðu inn endapunkt"
          />
        </Box>
      </Box>
      <Box marginBottom={7}>
        <Button
          variant="primary"
          onClick={() => {
            fetchAndValidateData()
          }}
        >
          Búa til aðgang
        </Button>
      </Box>

      {variables.map((Variable) => (
        //   Need copy button, should maybe be individual component
        <Box marginBottom={3} key={Variable.id}>
          <Input
            disabled
            label={Variable.name}
            name="Test1"
            value={Variable.value}
          />
        </Box>
      ))}
    </Box>
  )
}

export default TestEnvironment

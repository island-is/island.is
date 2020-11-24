import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Button, Input } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useFormContext, Controller } from 'react-hook-form'
import CopyToClipboardInput from '../../DocumentProvicerApplication/Components/CopyToClipboardInput/Index'

const TestEnvironment: FC<FieldBaseProps> = ({ application }) => {
  interface Variable {
    id: string
    name: string
    value: string
  }

  const { register, errors, trigger, getValues } = useFormContext()

  //Todo: move this
  const fetchAndValidateData = async (isValid: boolean) => {
    if (isValid) {
      fetch('/api/endPointVariables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            applicant: application.applicant,
            endPoint: getValues('endPoint'),
          },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setendPointVariables(data)
        })
        .catch((error) => {
          //Todo: show error
          console.error('Error:', error)
        })
    }
  }

  let [variables, setendPointVariables] = useState<Variable[]>([])
  console.log(variables)

  return (
    <Box>
      <Box marginBottom={7}>
        <Box marginBottom={3}>
          <FieldDescription description="Til að hægt sé að sækja skjöl til skjalaveitu þarf að tilgreina endapunkt. Þegar endapunktur er vistaður er búnar til Audience og Scope breytur." />
        </Box>
        <Box marginBottom={1}>
          <Controller
            defaultValue=""
            name={'endPoint'}
            render={() => (
              <Input
                label="Endapunktur"
                name={'endPoint'}
                id={'endPoint'}
                ref={register}
                defaultValue=""
                placeholder="Skráðu inn endapunkt"
                hasError={errors.endPoint !== undefined}
                errorMessage="Þú verður að skrá inn endapunkt"
              />
            )}
          />
        </Box>
      </Box>
      <Box marginBottom={7}>
        <Button
          variant="primary"
          onClick={() => {
            trigger(['endPoint']).then((answer) => fetchAndValidateData(answer))
          }}
        >
          Vista endapunkt
        </Button>
      </Box>

      {variables &&
        variables.map((Variable, index) => (
          <Box marginBottom={3} key={index}>
            <CopyToClipboardInput
              inputLabel={Variable.name}
              inputValue={Variable.value}
            ></CopyToClipboardInput>
          </Box>
        ))}
    </Box>
  )
}

export default TestEnvironment

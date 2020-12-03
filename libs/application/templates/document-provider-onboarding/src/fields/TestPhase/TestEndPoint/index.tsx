import React, { FC, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useFormContext, Controller } from 'react-hook-form'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box, Button, Input, Text } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'

import CopyToClipboardInput from '../../DocumentProvicerApplication/Components/CopyToClipboardInput/Index'
import { registerEndpointMutation } from '../../../graphql/mutations/registerEndpointMutation'

const TestEnvironment: FC<FieldBaseProps> = ({ field, application }) => {
  interface Variable {
    id: string
    name: string
    value: string
  }

  const {
    clearErrors,
    setValue,
    register,
    errors,
    trigger,
    getValues,
  } = useFormContext()
  const [variables, setendPointVariables] = useState<Variable[]>([])
  const [registerEndpoint] = useMutation(registerEndpointMutation)
  const currentAnswer = getValueViaPath(
    application.answers,
    'endPointExists' as string,
    '',
  ) as string

  const onRegisterEndpoint = async (isValid: boolean) => {
    if (isValid) {
      const result = await registerEndpoint({
        variables: {
          input: { endpoint: getValues('endPoint') },
        },
      })

      if (!result.data) {
        //TODO display error
      }

      setendPointVariables([
        {
          id: '1',
          name: 'Audience',
          value: result.data.registerEndpoint.audience,
        },
        { id: '2', name: 'Scope', value: result.data.registerEndpoint.scope },
      ])
      setValue('endPointExists' as string, 'true')

      clearErrors('endPointExists')
    }
  }

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
            trigger(['endPoint']).then((answer) => onRegisterEndpoint(answer))
          }}
        >
          Vista endapunkt
        </Button>
        <Box display="none">
          <Controller
            name="endPointExists"
            defaultValue={currentAnswer}
            rules={{ required: true }}
            render={() => {
              return <input type="hidden" name="endPointExists" />
            }}
          />
        </Box>
        {errors.endPointExists && (
          <Box color="red600" paddingY={2}>
            <Text fontWeight="semiBold" color="red600">
              {errors.endPointExists}
            </Text>
          </Box>
        )}
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

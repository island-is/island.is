import React, { FC, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useFormContext, Controller } from 'react-hook-form'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box, Button, Input, Text, Checkbox } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'

import CopyToClipboardInput from '../../DocumentProvicerApplication/Components/CopyToClipboardInput/Index'
import { registerEndpointMutation } from '../../../graphql/mutations/registerEndpointMutation'
import { m } from '../../../forms/messages'

const TestEnvironment: FC<FieldBaseProps> = ({ field, error, application }) => {
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
  const { answers: formValue } = application
  const [variables, setendPointVariables] = useState<Variable[]>([])

  const [endpointExists, setendpointExists] = useState(
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    formValue.endPointObject?.endPointExists || '',
  )
  const [registerEndpoint] = useMutation(registerEndpointMutation)

  const onRegisterEndpoint = async (isValid: boolean) => {
    if (isValid) {
      const result = await registerEndpoint({
        variables: {
          input: { endpoint: getValues('endPointObject.endPoint') },
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

      setendpointExists('true')
      // setValue('endPointObject.endPointExists' as string, 'true')

      clearErrors()
    }
  }

  return (
    <Box>
      <Box marginBottom={7}>
        <Box marginBottom={3}>
          <FieldDescription
            description={m.testEndPointSubTitle.defaultMessage}
          />
        </Box>
        <Box marginBottom={1}>
          <Controller
            defaultValue=""
            name={'endPointObject.endPoint'}
            render={() => (
              <Input
                label="Endapunktur"
                name={'endPointObject.endPoint'}
                id={'endPointObject.endPoint'}
                ref={register}
                defaultValue=""
                placeholder="Skráðu inn endapunkt"
                hasError={errors.endPointObject?.endPoint !== undefined}
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
            trigger(['endPointObject.endPoint']).then((answer) =>
              onRegisterEndpoint(answer),
            )
          }}
        >
          Vista endapunkt
        </Button>
        <input
          type="hidden"
          value={endpointExists}
          ref={register({ required: true })}
          name={'endPointObject.endPointExists'}
        />

        {errors['endPointObject.endPointExists'] && (
          <Box color="red600" paddingY={2}>
            <Text fontWeight="semiBold" color="red600">
              {errors['endPointObject.endPointExists']}
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

import React, { FC, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useFormContext, Controller } from 'react-hook-form'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Button, Input, Text } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'

import CopyToClipboardInput from '../../DocumentProvicerApplication/Components/CopyToClipboardInput/Index'
import { registerEndpointMutation } from '../../../graphql/mutations/registerEndpointMutation'
import { m } from '../../../forms/messages'

const TestEndPoint: FC<FieldBaseProps> = ({ application }) => {
  interface Variable {
    id: string
    name: string
    value: string
  }

  const { clearErrors, register, errors, trigger, getValues } = useFormContext()
  const { answers: formValue } = application
  const [variables, setendPointVariables] = useState<Variable[]>([])
  const [testEndPointError, setTestEndPointError] = useState<string | null>(
    null,
  )

  const [endpointExists, setendpointExists] = useState(
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    formValue.endPointObject?.endPointExists || '',
  )
  const [registerEndpoint] = useMutation(registerEndpointMutation)

  const onRegisterEndpoint = async (isValid: boolean) => {
    setTestEndPointError(null)
    if (isValid) {
      const result = await registerEndpoint({
        variables: {
          input: { endpoint: getValues('endPointObject.endPoint') },
        },
      })

      if (!result.data) {
        setTestEndPointError(m.testEndPointErrorMessage.defaultMessage)
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
      <Box
        marginBottom={7}
        display="flex"
        flexDirection="column"
        alignItems="flexEnd"
      >
        <Button
          variant="ghost"
          size="small"
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
          <Box color="red600" paddingY={2} display="flex">
            <Text fontWeight="semiBold" color="red600">
              {errors['endPointObject.endPointExists']}
            </Text>
          </Box>
        )}
        {testEndPointError && (
          <Box color="red600" paddingY={2}>
            <Text fontWeight="semiBold" color="red600">
              {testEndPointError}
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

export default TestEndPoint

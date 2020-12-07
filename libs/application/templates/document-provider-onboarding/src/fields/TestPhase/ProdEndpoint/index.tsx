import React, { FC, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useFormContext, Controller } from 'react-hook-form'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Button, Input } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'

import CopyToClipboardInput from '../../DocumentProvicerApplication/Components/CopyToClipboardInput/Index'
import { registerEndpointMutation } from '../../../graphql/mutations/registerEndpointMutation'
import { m } from '../../../forms/messages'

const ProdEndPoint: FC<FieldBaseProps> = ({ field, application }) => {
  interface Variable {
    id: string
    name: string
    value: string
  }

  const { register, errors, trigger, getValues } = useFormContext()
  const [variables, setendPointVariables] = useState<Variable[]>([])
  const [registerEndpoint] = useMutation(registerEndpointMutation)

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

      //TODO: Needs new call to API
      setendPointVariables([
        {
          id: '1',
          name: 'Audience',
          value: result.data.registerEndpoint.audience,
        },
        { id: '2', name: 'Scope', value: result.data.registerEndpoint.scope },
      ])
    }
  }

  return (
    <Box>
      <Box marginBottom={7}>
        <Box marginBottom={3}>
          <FieldDescription
            description={m.prodEndPointSubTitle.defaultMessage}
          />
        </Box>
        <Box marginBottom={1}>
          <Controller
            defaultValue=""
            name={'prodEndPoint'}
            render={() => (
              <Input
                label="Endapunktur"
                name={'prodEndPoint'}
                id={'prodEndPoint'}
                ref={register}
                defaultValue=""
                placeholder="Skráðu inn endapunkt"
                hasError={errors.prodEndPoint !== undefined}
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
            trigger(['prodEndPoint']).then((answer) =>
              onRegisterEndpoint(answer),
            )
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

export default ProdEndPoint

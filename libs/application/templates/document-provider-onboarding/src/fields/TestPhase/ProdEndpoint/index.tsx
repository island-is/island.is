import React, { FC, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useFormContext, Controller } from 'react-hook-form'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Button, Input, Text } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'

import CopyToClipboardInput from '../../DocumentProvicerApplication/Components/CopyToClipboardInput/Index'
import { registerEndpointMutation } from '../../../graphql/mutations/registerEndpointMutation'
import { m } from '../../../forms/messages'

const ProdEndPoint: FC<FieldBaseProps> = ({ application }) => {
  interface Variable {
    id: string
    name: string
    value: string
  }

  const { register, clearErrors, errors, trigger, getValues } = useFormContext()
  const { answers: formValue } = application
  const [variables, setendPointVariables] = useState<Variable[]>([])
  const [prodEndPointExists, setprodEndPointExists] = useState(
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    formValue.productionEndPointObject?.prodEndPointExists || '',
  )
  const [registerEndpoint] = useMutation(registerEndpointMutation)

  const onRegisterEndpoint = async (isValid: boolean) => {
    if (isValid) {
      const result = await registerEndpoint({
        variables: {
          input: {
            endpoint: getValues('productionEndPointObject.prodEndPoint'),
          },
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
      setprodEndPointExists('true')
      clearErrors()
    }
  }

  console.log(errors)

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
            name={'productionEndPointObject.prodEndPoint'}
            render={() => (
              <Input
                label="Endapunktur"
                name={'productionEndPointObject.prodEndPoint'}
                id={'productionEndPointObject.prodEndPoint'}
                ref={register}
                defaultValue=""
                placeholder="Skráðu inn endapunkt"
                hasError={
                  errors.productionEndPointObject?.prodEndPoint !== undefined
                }
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
            trigger(['productionEndPointObject.prodEndPoint']).then((answer) =>
              onRegisterEndpoint(answer),
            )
          }}
        >
          Vista endapunkt
        </Button>
        <input
          type="hidden"
          value={prodEndPointExists}
          ref={register({ required: true })}
          name={'productionEndPointObject.prodEndPointExists'}
        />

        {errors['productionEndPointObject.prodEndPointExists'] && (
          <Box color="red600" paddingY={2}>
            <Text fontWeight="semiBold" color="red600">
              {errors['productionEndPointObject.prodEndPointExists']}
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

export default ProdEndPoint

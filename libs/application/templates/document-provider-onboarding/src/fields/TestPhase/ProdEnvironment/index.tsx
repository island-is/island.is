import React, { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'

import CopyToClipboardInput from '../../DocumentProvicerApplication/Components/CopyToClipboardInput/Index'
import { registerProviderMutation } from '../../../graphql/mutations/registerProviderMutation'
import { m } from '../../../forms/messages'

const ProdEnvironment: FC<FieldBaseProps> = ({ error, application }) => {
  interface Key {
    name: string
    value: string
  }

  const { register, clearErrors } = useFormContext()
  const [keys, setKeys] = useState<Key[]>([])
  const [prodEnvironmentError, setProdEnvironmentErrorError] = useState<
    string | null
  >(null)
  const { answers: formValue } = application
  const [currentAnswer, setCurrentAnswer] = useState(
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    (formValue.productionUserExists as string) || '',
  )
  const [registerProvider] = useMutation(registerProviderMutation)

  const onRegister = async () => {
    setProdEnvironmentErrorError(null)
    const credentials = await registerProvider({
      variables: {
        input: { nationalId: '2404805659' }, //TODO set real nationalId
      },
    })

    if (!credentials.data) {
      setProdEnvironmentErrorError(m.prodEnviromentErrorMessage.defaultMessage)
    }

    setKeys([
      {
        name: 'Client ID',
        value: credentials.data.registerProvider.clientId,
      },
      {
        name: 'Secret key',
        value: credentials.data.registerProvider.clientSecret,
      },
    ])
    setCurrentAnswer('true')

    clearErrors('productionUserExists')
  }

  return (
    <Box>
      <Box marginBottom={7} />
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
            onRegister()
          }}
        >
          {m.prodEnviromentButton.defaultMessage}
        </Button>
        <input
          type="hidden"
          value={currentAnswer}
          ref={register({ required: true })}
          name={'productionUserExists'}
        />
        {error && (
          <Box color="red600" paddingY={2}>
            <Text fontWeight="semiBold" color="red600">
              {error}
            </Text>
          </Box>
        )}
        {prodEnvironmentError && (
          <Box color="red600" paddingY={2}>
            <Text fontWeight="semiBold" color="red600">
              {prodEnvironmentError}
            </Text>
          </Box>
        )}
      </Box>

      {keys.map((Key, index) => (
        <Box marginBottom={3} key={index}>
          <CopyToClipboardInput
            inputLabel={Key.name}
            inputValue={Key.value}
          ></CopyToClipboardInput>
        </Box>
      ))}
    </Box>
  )
}

export default ProdEnvironment

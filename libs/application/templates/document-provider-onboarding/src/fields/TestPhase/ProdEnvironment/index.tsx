import React, { FC, useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'

import CopyToClipboardInput from '../../DocumentProvicerApplication/Components/CopyToClipboardInput/Index'
import { registerProviderMutation } from '../../../graphql/mutations/registerProviderMutation'
import { m } from '../../../forms/messages'

const ProdEnvironment: FC<FieldBaseProps> = ({ application }) => {
  // TODO: Add this to types file ?
  interface Key {
    name: string
    value: string
  }

  const { setValue, clearErrors, errors } = useFormContext()
  const [keys, setKeys] = useState<Key[]>([])
  const [registerProvider] = useMutation(registerProviderMutation)

  const currentAnswer = getValueViaPath(
    application.answers,
    'productionUserExists' as string,
    '',
  ) as string

  const onRegister = async () => {
    const credentials = await registerProvider({
      variables: {
        input: { nationalId: '2404805659' }, //TODO set real nationalId
      },
    })

    if (!credentials.data) {
      //TODO display error
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
    setValue('productionUserExists' as string, 'true')

    clearErrors('productionUserExists')
  }

  return (
    //TODO: we can make this a generic component for reuasabilty, same as TEST environment
    <Box>
      <Box marginBottom={7} />
      <Box marginBottom={7}>
        <Button
          variant="primary"
          onClick={() => {
            onRegister()
          }}
        >
          {m.prodEnviromentButton.defaultMessage}
        </Button>
        <Box display="none">
          <Controller
            name="productionUserExists"
            defaultValue={currentAnswer}
            rules={{ required: true }}
            render={() => {
              return <input type="hidden" name="productionUserExists" />
            }}
          />
        </Box>
        {errors.productionUserExists && (
          <Box color="red600" paddingY={2}>
            <Text fontWeight="semiBold" color="red600">
              {errors.productionUserExists}
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

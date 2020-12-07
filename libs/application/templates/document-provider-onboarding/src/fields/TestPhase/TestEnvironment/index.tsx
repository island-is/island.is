import React, { FC, useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box, Button, Text, Checkbox } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'

import CopyToClipboardInput from '../../DocumentProvicerApplication/Components/CopyToClipboardInput/Index'
import { m } from '../../../forms/messages'
import { registerProviderMutation } from '../../../graphql/mutations/registerProviderMutation'

const TestEnvironment: FC<FieldBaseProps> = ({ application }) => {
  interface Key {
    name: string
    value: string
  }

  const { setValue, clearErrors, errors } = useFormContext()

  const [keys, setKeys] = useState<Key[]>([])
  const [registerProvider] = useMutation(registerProviderMutation)

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

    setValue('testUserExists' as string, true)

    clearErrors('testUserExists')
  }

  const { answers: formValue } = application

  const currentAnswer = getValueViaPath(
    formValue,
    'testUserExists' as string,
    false,
  ) as boolean

  return (
    //TODO: we can make this a generic component for reuasabilty, same as production environment
    <Box>
      <Box marginBottom={7}>
        <Box marginBottom={3}>
          <FieldDescription
            description={m.testEnviromentFieldDescription.defaultMessage}
          />
        </Box>
        <Box marginBottom={1}>
          <Text variant="h3">{m.testEnviromentSubHeading.defaultMessage}</Text>
          <Text>{m.testEnviromentSubMessage.defaultMessage}</Text>{' '}
        </Box>
      </Box>
      <Box></Box>
      <Box marginBottom={7}>
        <Button
          variant="primary"
          onClick={() => {
            onRegister()
          }}
        >
          Búa til aðgang
        </Button>
        <Controller
          name="testUserExists"
          defaultValue={currentAnswer}
          rules={{ required: true }}
          render={({ value }) => {
            return (
              <Box display="none">
                <Controller
                  name="testUserExists"
                  defaultValue={currentAnswer}
                  rules={{ required: true }}
                  render={({ value }) => {
                    return (
                      <Checkbox
                        checked={value}
                        name="testUserExists"
                        id="testUserExists"
                      />
                    )
                  }}
                />
              </Box>
            )
          }}
        />

        {errors.testUserExists && (
          <Box color="red600" paddingY={2}>
            <Text fontWeight="semiBold" color="red600">
              {errors.testUserExists}
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

export default TestEnvironment

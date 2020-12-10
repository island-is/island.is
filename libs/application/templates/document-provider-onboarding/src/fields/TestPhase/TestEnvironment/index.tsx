import React, { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import CopyToClipboardInput from '../../DocumentProvicerApplication/Components/CopyToClipboardInput/Index'
import { m } from '../../../forms/messages'
import { registerProviderMutation } from '../../../graphql/mutations/registerProviderMutation'

const TestEnvironment: FC<FieldBaseProps> = ({ application, error }) => {
  const { formatMessage } = useLocale()
  interface Key {
    name: string
    value: string
  }
  const { answers: formValue } = application
  const { register, clearErrors } = useFormContext()

  const [keys, setKeys] = useState<Key[]>([])
  const [currentAnswer, setCurrentAnswer] = useState(
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    (formValue.testUserExists as string) || '',
  )
  const [environmentError, setEnvironmentError] = useState<string | null>(null)
  const [registerProvider] = useMutation(registerProviderMutation)

  const onRegister = async () => {
    setEnvironmentError(null)
    const credentials = await registerProvider({
      variables: {
        input: { nationalId: '2404805659' }, //TODO set real nationalId
      },
    })

    if (!credentials.data) {
      setEnvironmentError(m.testEnviromentErrorMessage.defaultMessage)
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

    clearErrors('testUserExists')
  }

  return (
    <Box>
      <Box marginBottom={7}>
        <Box marginBottom={3}>
          <FieldDescription
            description={formatText(
              m.testEnviromentFieldDescription,
              application,
              formatMessage,
            )}
          />
        </Box>
        <Box marginBottom={1}>
          <Text variant="h3">
            {formatText(m.testEnviromentSubHeading, application, formatMessage)}
          </Text>
          <Text>
            {formatText(m.testEnviromentSubMessage, application, formatMessage)}
          </Text>
        </Box>
      </Box>
      <Box></Box>
      <Box
        marginBottom={7}
        display="flex"
        alignItems="flexEnd"
        flexDirection="column"
      >
        <Button
          variant="ghost"
          size="small"
          onClick={() => {
            onRegister()
          }}
        >
          Búa til aðgang
        </Button>
        <input
          type="hidden"
          value={currentAnswer}
          ref={register({ required: true })}
          name={'testUserExists'}
        />
        {error && (
          <Box color="red600" paddingY={2}>
            <Text fontWeight="semiBold" color="red600">
              {error}
            </Text>
          </Box>
        )}
        {environmentError && (
          <Box color="red600" paddingY={2}>
            <Text fontWeight="semiBold" color="red600">
              {environmentError}
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

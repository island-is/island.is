import React, { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'

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
    (formValue.testProviderId as string) || '',
  )
  const [environmentError, setEnvironmentError] = useState<string | null>(null)
  const [registerProvider] = useMutation(registerProviderMutation)
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const nationalId = getValueViaPath(
    application.answers,
    'applicant.nationalId',
    undefined,
  ) as string

  const clientName = getValueViaPath(
    application.answers,
    'applicant.name',
    undefined,
  ) as string

  const onRegister = async () => {
    setEnvironmentError(null)
    const credentials = await registerProvider({
      variables: {
        input: { nationalId: nationalId, clientName: clientName },
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

    setCurrentAnswer(credentials.data.registerProvider.providerId)

    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            testProviderId: credentials.data.registerProvider.providerId,
            ...application.answers,
          },
        },
      },
    }).then((response) => {
      application.answers = response.data?.updateApplication?.answers
    })

    clearErrors('testProviderId')
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
        <Box marginBottom={3}>
          <Text>
            <strong>
              {formatText(
                m.testEnviromentStrongText,
                application,
                formatMessage,
              )}
            </strong>
          </Text>
        </Box>
      </Box>
      <Box
        marginBottom={7}
        display="flex"
        alignItems="flexEnd"
        flexDirection="column"
      >
        <Button
          variant="ghost"
          size="small"
          disabled={currentAnswer !== ''}
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
          name={'testProviderId'}
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
